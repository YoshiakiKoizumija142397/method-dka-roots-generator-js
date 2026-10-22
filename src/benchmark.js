const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- パス設定 ---
// 確実な連携のため、method-dka-core への絶対パスを指定します
const CORE_DIR = 'C:\\Users\\ja142\\source\\repos\\YoshiakiKoizumija142397\\method-dka-core';
const INPUT_TXT_PATH = path.join(CORE_DIR, 'input.txt');
const OUTPUT_TXT_PATH = path.join(CORE_DIR, 'output.txt');

// ジェネレータが作成したJSONデータのパス
const DATA_FILE = path.resolve(__dirname, '../close-roots-test-data.json');

// --- MethodDkaコア 実行コマンド ---
// 実行ファイルを index.js に修正しました
const RUN_COMMAND = 'node index.js'; 

function main() {
    console.log("=== MethodDka 自動ベンチマーク検証開始 ===\n");

    if (!fs.existsSync(CORE_DIR)) {
        console.error(`[エラー] method-dka-core ディレクトリが見つかりません:\n${CORE_DIR}`);
        console.error("パス設定 (CORE_DIR) を確認してください。");
        return;
    }

    if (!fs.existsSync(DATA_FILE)) {
        console.error("[エラー] close-roots-test-data.json が見つかりません。先に npm start を実行してください。");
        return;
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    for (const testCase of data.cases) {
        console.log(`▶ テストケース: ${testCase.name}`);
        console.log(`  説明: ${testCase.description}`);

        const inputLines = [];
        inputLines.push(...testCase.exact_coefficients);
        
        fs.writeFileSync(INPUT_TXT_PATH, inputLines.join('\n'), 'utf-8');
        console.log(`  [1] ${testCase.name} の係数を ${INPUT_TXT_PATH} に書き込みました。`);

        try {
            console.log(`  [2] MethodDka CUI (v3.5.0) を実行中... (ライブ進捗表示)\n`);
            
            // ★変更点: stdio: 'inherit' にすることで、コアの進捗バーが直接ターミナルに表示されます
            execSync(RUN_COMMAND, { 
                cwd: CORE_DIR, 
                stdio: 'inherit' 
            });

            // 出力の読み込み (output.txt から取得)
            let resultText = "";
            if (fs.existsSync(OUTPUT_TXT_PATH)) {
                resultText = fs.readFileSync(OUTPUT_TXT_PATH, 'utf-8');
                console.log(`\n  [3] 結果 (output.txt から取得):`);
            } else {
                resultText = "結果ファイルが見つかりませんでした。";
                console.log(`\n  [3] 結果:`);
            }

            console.log(`--------------------------------------------------`);
            console.log(resultText.trim());
            console.log(`--------------------------------------------------\n`);

        } catch (error) {
            console.error(`  [エラー] CUIの実行に失敗しました: ${error.message}`);
        }
    }
    console.log("=== 全テストケースの検証が完了しました ===");
}

main();