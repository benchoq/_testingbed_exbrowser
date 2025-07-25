
import * as fs from 'fs';

export class QDocReader {
  private _lines: string[] = [];

  public constructor(fsPath?: string) {
    if (fsPath) {
      this.load(fsPath);
    }
  }

  public load(fsPath: string) {
    this._lines = fs.readFileSync(fsPath, 'utf-8').split('\n');
  }

  public title() {
    return this.get('title');
  }

  public projectDir() {
    return this.get('example');
  }

  public image() {
    const v = this.get('image');
    return v.split(' ')[0] ?? '';
  }

  public categories(): string[] {
    const v = this.getAll('examplecategory');
    return v;
  }

  public get(tag: string): string {
    const regex = new RegExp(`^\\s*\\\\${tag}\\s+(.+)`);

    for (const line of this._lines) {
      const match = regex.exec(line);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return '';
  }

  public getAll(tag: string): string[] {
    const regex = new RegExp(`^\\s*\\\\${tag}\\s+(.+)`);

    return this._lines
      .map(line => regex.exec(line))
      .filter((m): m is RegExpExecArray => m !== null)
      .map(m => m[1]?.trim() ?? '');
  }
}
