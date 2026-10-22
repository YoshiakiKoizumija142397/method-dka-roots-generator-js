const fs = require('fs');
const { generateExactCoefficients } = require('./generator');

function main() {
    console.log("MethodDka 近接根係数データジェネレータを開始します...\n");

    // パターンA: 2進数で正確に表現できる近接根 (0.5 ベース)
    // r1 = 0.5, r2 = 0.500030517578125 (0.5 + 2^-15)
    const rootsA = ["0.5", "0.500030517578125"];
    const coeffsA = generateExactCoefficients(rootsA);

    // パターンB: 10進数特有の変換誤差を伴う近接根 (0.1 ベース)
    // r1 = 0.1, r2 = 0.10001 (0.1 + 10^-5)
    const rootsB = ["0.1", "0.10001"];
    const coeffsB = generateExactCoefficients(rootsB);

    // CUI版 v3.4.0 検証用データフォーマット
    const outputData = {
        project: "MethodDka-Roots-Generator",
        version: "1.0.0",
        description: "Close roots coefficient generation for precision testing",
        cases: [
            {
                name: "Pattern A (Binary Exact)",
                description: "2進数で正確に表現できる根(0.5ベース)。純粋な桁落ち検証用。",
                degree: rootsA.length,
                roots: rootsA,
                exact_coefficients: coeffsA
            },
            {
                name: "Pattern B (Decimal Conversion Error)",
                description: "2進数変換時に無限循環小数となる根(0.1ベース)。変換誤差＋桁落ち検証用。",
                degree: rootsB.length,
                roots: rootsB,
                exact_coefficients: coeffsB
            }
        ]
    };

    // JSONとして整形して出力
    const jsonOutput = JSON.stringify(outputData, null, 2);
    
    // コンソールに結果を表示（確認用）
    console.log(jsonOutput);

    // ファイルに保存
    const outputFile = 'close-roots-test-data.json';
    fs.writeFileSync(outputFile, jsonOutput);
    console.log(`\n[成功] テストデータを '${outputFile}' に出力しました。`);
    console.log("このJSONファイルの exact_coefficients を MethodDka CUI版に入力して検証してください。");
}

main();