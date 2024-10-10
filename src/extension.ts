import { printf } from "fast-printf";
import * as vscode from "vscode";

const DEFAULT_FORMAT_STRING = "%d";
const PROMPT_START_NUMBER = "Enter start number";
const PROMPT_INCREMENT_NUMBER = "Enter increment number";
const PROMPT_FORMAT_STRING = "Enter C format string (e.g. %d)";

export function cstringFormat(format: string, n: number) {
  return printf(format, n);
}

export function getAccuracy(n: number) {
  const str = n.toString();
  const index = str.indexOf(".");
  if (index === -1) {
    return 0;
  }
  return str.length - index - 1;
}

export function multiply(a: number, b: number) {
  const accuracy = Math.max(getAccuracy(a), getAccuracy(b));
  return parseFloat((a * b).toFixed(accuracy));
}

export function add(a: number, b: number) {
  const accuracy = Math.max(getAccuracy(a), getAccuracy(b));
  return parseFloat((a + b).toFixed(accuracy));
}

type Preset = {
  /**
   * Start number. If not provided, it will prompt the user for input
   */
  start?: number;
  /**
   * Placeholder for start number. Only used if start is not provided
   */
  startPlaceholder?: string;
  /**
   * Increment number. If not provided, it will prompt the user for input
   */
  increment?: number;
  /**
   * Placeholder for increment number. Only used if increment is not provided
   */
  incrementPlaceholder?: string;
  /**
   * Format string. If not provided, it will prompt the user for input
   */
  format?: string;
  /**
   * Placeholder for format string. Only used if format is not provided
   */
  formatPlaceholder?: string;
};

const presets: { [key: string]: Preset } = {
  increment: {
    startPlaceholder: "0",
    incrementPlaceholder: "1",
    formatPlaceholder: DEFAULT_FORMAT_STRING,
  },
  incrementIndexed0: {
    start: 0,
    increment: 1,
    format: "%d",
  },
  incrementIndexed1: {
    start: 1,
    increment: 1,
    format: "%d",
  },
};

async function getInput(prompt: string, options: vscode.InputBoxOptions) {
  return await vscode.window.showInputBox({
    prompt: prompt,
    ignoreFocusOut: true,
    ...options,
  });
}

async function promptForNumber(message: string, placeholder: string) {
  const input = await getInput(message, {
    value: placeholder,
    validateInput(value) {
      return isNaN(parseFloat(value)) ? "Invalid number" : null;
    },
  });
  if (input === undefined || isNaN(parseFloat(input))) {
    vscode.window.showErrorMessage("Invalid number");
    throw new Error("Invalid number");
  }
  return parseFloat(input);
}

function registerCommand(cmd: string, preset: Preset) {
  return vscode.commands.registerCommand(cmd, async () => {
    let start = preset.start ?? 0;
    if (preset.start === undefined && preset.startPlaceholder) {
      start = await promptForNumber(
        PROMPT_START_NUMBER,
        preset.startPlaceholder
      );
    }

    let increment = preset.increment ?? 1;
    if (preset.increment === undefined && preset.incrementPlaceholder) {
      increment = await promptForNumber(
        PROMPT_INCREMENT_NUMBER,
        preset.incrementPlaceholder
      );
    }

    let format = preset.format ?? DEFAULT_FORMAT_STRING;
    if (preset.format === undefined && preset.formatPlaceholder) {
      const returnedFormat = await getInput(PROMPT_FORMAT_STRING, {
        value: preset.formatPlaceholder,
      });

      if (!returnedFormat) {
        vscode.window.showErrorMessage("Invalid format string");
        return;
      }

      format = returnedFormat;
    }

    await applyIncrement(start, increment, format);
  });
}

function registerCommands(context: vscode.ExtensionContext) {
  for (const [cmd, preset] of Object.entries(presets)) {
    context.subscriptions.push(registerCommand(cmd, preset));
  }
}

export function activate(context: vscode.ExtensionContext) {
  registerCommands(context);
}

export function getIncrementedNumber(
  start: number,
  increment: number,
  index: number
) {
  return add(multiply(increment, index), start);
}

async function applyIncrement(
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
    const incremented = getIncrementedNumber(start, increment, i);
    const newNumber = cstringFormat(format, incremented);
    edit.insert(
      editor.document.uri,
      new vscode.Position(cursor.active.line, insertPosition),
      newNumber
    );
  }

  await vscode.workspace.applyEdit(edit);
}

export function deactivate() {}
