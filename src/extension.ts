import * as vscode from 'vscode';
import ChatGptViewProvider from './components/chatgpt-view-provider';

export async function activate(context: vscode.ExtensionContext) {
	const chatViewProvider = new ChatGptViewProvider(context);
	let activeLine: number | undefined

	context.subscriptions.push(
		vscode.commands.registerCommand('chatgpt-vscode-plugin.askGPT', askChatGPT),
		vscode.commands.registerCommand('chatgpt-vscode-plugin.whyBroken', askGPTWhyBroken),
		vscode.commands.registerCommand('chatgpt-vscode-plugin.explainPls', askGPTToExplain),
		vscode.commands.registerCommand('chatgpt-vscode-plugin.refactor', askGPTToRefactor),
		vscode.commands.registerCommand('chatgpt-vscode-plugin.addTests', askGPTToAddTests),
		vscode.commands.registerCommand('chatgpt-vscode-plugin.resetToken', resetToken),
		vscode.window.onDidChangeTextEditorSelection(e => {
			activeLine = e.selections[0].active.line;
			
			console.log(activeLine)
		}),

		vscode.languages.registerCodeLensProvider(
			{ scheme: '*', language: '*' },
			{
				provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
					const codeLens: vscode.CodeLens[] = [];

					if (activeLine !== undefined) {
						const range = new vscode.Range(activeLine, 0, activeLine, 0);
						const command: vscode.Command = {
							title: 'Click para copiar',
							command: 'extension.copyCode',
							arguments: [document.lineAt(activeLine).text],
						};
						codeLens.push(new vscode.CodeLens(range, command));
					}

					return codeLens;
				},
			}
		),

		vscode.window.registerWebviewViewProvider("chatgpt-vscode-plugin.view", chatViewProvider, {
			webviewOptions: { retainContextWhenHidden: true }
		})
	);

	async function askGPTToExplain() { await askChatGPT('Can you explain what this code does?'); }
	async function askGPTWhyBroken() { await askChatGPT('Why is this code broken?'); }
	async function askGPTToRefactor() { await askChatGPT('Can you refactor this code and explain what\'s changed?'); }
	async function askGPTToAddTests() { await askChatGPT('Can you add tests for this code?'); }

	async function resetToken() {
		await context.globalState.update('chatgpt-session-token', null);
		await context.globalState.update('chatgpt-clearance-token', null);
		await context.globalState.update('chatgpt-user-agent', null);
		await chatViewProvider.ensureApiKey();
		// await vscode.window.showInformationMessage("Token reset, you'll be prompted for it next to you next ask ChatGPT a question.");
	}

	async function askChatGPT(userInput?: string) {

		console.log(userInput);

		if (!userInput) {
			userInput = await vscode.window.showInputBox({ prompt: "Ask ChatGPT a question" }) || "";
		}

		let editor = vscode.window.activeTextEditor;

		if (editor) {
			const selectedCode = editor.document.getText(vscode.window.activeTextEditor?.selection);
			const entireFileContents = editor.document.getText();

			const code = selectedCode
				? selectedCode
				: `This is the ${editor.document.languageId} file I'm working on: \n\n${entireFileContents}`;

			chatViewProvider.sendOpenAiApiRequest(userInput, code);
		}
	}
}
