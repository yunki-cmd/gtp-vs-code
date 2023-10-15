import OpenAI from 'openai';
import * as vscode from 'vscode';
import path = require('path');

export default class ChatGptViewProvider implements vscode.WebviewViewProvider {
    private webView?: vscode.WebviewView;
    private openAiApi?: OpenAI;
    private apiKey?: string;
    private message?: any;

    constructor(private context: vscode.ExtensionContext) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this.webView = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri],
        };

        webviewView.webview.html = this.getHtml(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {

            if (data.type === 'askChatGPT') {
                this.sendOpenAiApiRequest(data.value);
            }
        });
        if (this.message !== null && this.message !== undefined) {
            this.sendMessageToWebView(this.message);
            this.message = null;
        }
    }

    public async ensureApiKey() {
        let secret = await this.context.secrets;
        this.apiKey = await secret.get('chatgpt-api-key') as string;
        if (!this.apiKey) {
            const apiKeyInput = await vscode.window.showInputBox({
                prompt: "Please enter your OpenAI API Key, can be located at https://openai.com/account/api-keys",
                ignoreFocusOut: true,
            });
            this.apiKey = apiKeyInput!;
            secret.store('chatgpt-api-key', this.apiKey);
            // this.context.globalState.update('chatgpt-api-key', this.apiKey);
        }
    }

    public async sendOpenAiApiRequest(prompt: string | [], code?: string) {
        await this.ensureApiKey();
        if (!this.openAiApi) {
            try {
                this.openAiApi = new OpenAI({ apiKey: this.apiKey });
            } catch (error: any) {
                vscode.window.showErrorMessage("Failed to connect to ChatGPT", error?.message);
                return;
            }
        }

        // Create question by adding prompt prefix to code, if provided
        let question = prompt;
        if (prompt instanceof Array) {
            question = prompt;
        } else {
            const questionArray = (code) ? `${prompt}: ${code}` : prompt;
            question = [{ role: 'user', content: questionArray }];
        }

        if (!this.webView) {
            await vscode.commands.executeCommand('chatgpt-vscode-plugin.view.focus');
        } else {
            this.webView?.show?.(true);
        }

        this.sendMessageToWebView({ type: 'addQuestion', value: prompt, code });
        try {
            let currentMessageNumber = this.message;
            let completion;
            console.log(question);
            try {
                completion = await this.openAiApi.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: question,
                    temperature: 0.5,
                    stop: ['\n\n\n', '<|im_end|>'],
                });

               /*  for await (const part of completion) {
                    console.log(part);
                    console.log(part.choices[0]?.finish_reason);
                    console.log(part.choices[0]?.delta || '');
                    this.sendMessageToWebView({ type: 'addResponse', value: completion });
                } */

            } catch (error: any) {
                await vscode.window.showErrorMessage("Error sending request to ChatGPT", error);
                return;
            }

            if (this.message !== currentMessageNumber) {
                return;
            }

            /* response = completion?.choices[0].message.content || ''; */

            /* const REGEX_CODEBLOCK = new RegExp('\`\`\`', 'g');
            const matches = response.match(REGEX_CODEBLOCK);
            const count = matches ? matches.length : 0;
            if (count % 2 !== 0) {
                response += '\n\`\`\`';
            } */

            this.sendMessageToWebView({ type: 'addResponse', value: completion });
        } catch (error: any) {
            await vscode.window.showErrorMessage("Error sending request to ChatGPT", error);
            return;
        }
    }

    public sendMessageToWebView(message: any) {
        if (this.webView) {
            this.webView?.webview.postMessage(message);
        } else {
            this.message = message;
        }
    }

    private getHtml(webview: vscode.Webview) {


        const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/assets', 'index.css'));
        const scriptJs = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist/assets', 'index.js'));
        const baseUri = vscode.Uri.file(path.join(this.context.extensionPath, 'dist')).with({ scheme: 'vscode-resource' });

        return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${stylesMainUri}" rel="stylesheet">
            <script type="module" crossorigin src="${scriptJs}"></script>
            <base href="${baseUri}/">
        </head>
        <body>
            <div id="root"></div>
        </body>
        </html>`;

        /* const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.js'));
        const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.css'));

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${stylesMainUri}" rel="stylesheet">
                <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="overflow-hidden">
                <div class="flex flex-col h-screen">
                    <div class="flex-1 overflow-y-auto" id="qa-list"></div>
                    <div id="in-progress" class="p-4 flex items-center hidden">
                        <div style="text-align: center;">
                            <div>Please wait while we handle your request ❤️</div>
                            <div class="loader"></div>
                            <div>Please note, ChatGPT facing scaling issues which will impact this extension</div>
                        </div>
                    </div>
                    <div class="p-4 flex items-center">
                        <div class="flex-1">
                            <textarea
                                type="text"
                                rows="2"
                                class="border p-2 w-full"
                                id="question-input"
                                placeholder="Ask a question..."
                            ></textarea>
                        </div>
                        <button style="background: var(--vscode-button-background)" id="ask-button" class="p-2 ml-5">Ask</button>
                        <button style="background: var(--vscode-button-background)" id="clear-button" class="p-2 ml-3">Clear</button>
                    </div>
                </div>
                <script src="${scriptUri}"></script>
            </body>
            </html>`; */
    }
}