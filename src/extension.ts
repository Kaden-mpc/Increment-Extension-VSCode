import { printf } from "fast-printf";
import * as vscode from "vscode";

async function getInput(prompt: string, options: vscode.InputBoxOptions) {
  return await vscode.window.showInputBox({
    prompt: prompt,
    ignoreFocusOut: true,
    ...options,
  });
}

function cstringFormat(format: string, n: number) {
  return printf(format, n);
}

function validateFormatString(format: string) {
  return cstringFormat(format, 1) !== format;
}

function getAccuracy(n: number) {
  const str = n.toString();
  const index = str.indexOf(".");
  if (index === -1) {
    return 0;
  }
  return str.length - index - 1;
}

function multiply(a: number, b: number) {
  const accuracy = Math.max(getAccuracy(a), getAccuracy(b));
  return parseFloat((a * b).toFixed(accuracy));
}

function divide(a: number, b: number) {
  const accuracy = Math.max(getAccuracy(a), getAccuracy(b));
  return parseFloat((a / b).toFixed(accuracy));
}

const defaultFormatString = "%d";

export function activate(context: vscode.ExtensionContext) {
  const disposableIncrement = vscode.commands.registerCommand(
    "increment-extension.increment",
    async () => {
      const startNumber = await getInput("Enter start number", {
        value: "0",
      });
      if (!startNumber || isNaN(parseFloat(startNumber))) {
        vscode.window.showErrorMessage("Invalid number");
        return;
      }
      const startNumberInt = parseFloat(startNumber);

      // Ask the user for increment number
      const incrementNumber = await getInput("Enter increment number", {
        value: "1",
      });

      if (!incrementNumber || isNaN(parseFloat(incrementNumber))) {
        vscode.window.showErrorMessage("Invalid number");
        return;
      }
      const incrementNumberInt = parseFloat(incrementNumber);

      // Ask the user for a c format string
      const formatString = await getInput("Enter format string", {
        value: defaultFormatString,
      });

      if (!formatString) {
        vscode.window.showErrorMessage("Invalid format string");
        return;
      }

      if (!validateFormatString(formatString)) {
        vscode.window.showWarningMessage("Format result is same as input");
      }

      applyIncrement(startNumberInt, incrementNumberInt, formatString);
    }
  );

  const disposableAutoIncrement0 = vscode.commands.registerCommand(
    "increment-extension.increment-indexed-0",
    async () => {
      applyIncrement(0, 1, "%d");
    }
  );

  const disposableAutoIncrement1 = vscode.commands.registerCommand(
    "increment-extension.increment-indexed-1",
    async () => {
      applyIncrement(1, 1, "%d");
    }
  );

  context.subscriptions.push(disposableIncrement);
  context.subscriptions.push(disposableAutoIncrement0);
  context.subscriptions.push(disposableAutoIncrement1);
}

export function applyIncrement(
  start: number,
  increment: number,
  format: string
) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const cursors = editor.selections;

  const edit = new vscode.WorkspaceEdit();

  for (let i = 0; i < cursors.length; i++) {
    const cursor = cursors[i];
    const insertPosition = cursor.active.character;
    const offset = increment + start;
    const newNumber = cstringFormat(format, multiply(i, offset));
    edit.insert(
      editor.document.uri,
      new vscode.Position(cursor.active.line, insertPosition),
      newNumber
    );
  }

  vscode.workspace.applyEdit(edit);
}

export function deactivate() {}
