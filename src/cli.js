const fs = require('fs');
const path = require('path');
const { generateExactCoefficients } = require('./generator');

// 全5パターンの限界突破テストスイート
const testCases = [
    {
        name: "Pattern A (Binary Exact)",
        description: "2進数で正確に表現できる根(0.5ベース)。純粋な桁落ち検証用。",
        roots: ["0.5", "0.500030517578125"]
    },
    {
        name: "Pattern B (Decimal Conversion Error)",
        description: "2進数変換時に無限循環小数となる根(0.1ベース)。変換誤差＋桁落ち検証用。",
        roots: ["0.1", "0.10001"]
    },
    {
        name: "Pattern C (Ultra Close Roots)",
        description: "距離が1e-50の極限近接根。ユン平方無因子分解が重根と誤認せずに独立根として分離できるかの限界テスト。",
        roots: [
            "0.5", 
            "0.50000000000000000000000000000000000000000000000001"
        ]
    },
    {
        name: "Pattern D (Perfect 10x Multiple Root)",
        description: "完全に値が一致する10重根。ユン平方無因子分解が「重複度10の因子が1つ」として完璧に抽出できるかのテスト。",
        roots: Array(10).fill("0.5") // "0.5"を10個生成
    },
    {
        name: "Pattern E (High-degree with Close Roots)",
        description: "10次方程式の中に0.1ベースの近接根を紛れ込ませた複合テスト。ソルバーの総合的な安定性を試す。",
        roots: ["1", "2", "3", "0.1", "0.10001", "4", "5", "6", "7", "8"]
    }
];

function main() {
    console.log("=== MethodDka 近接根係数ジェネレータ (全5パターン) ===\n");
    const data = {
        generated_at: new Date().toISOString(),
        cases: []
    };

    for (const tc of testCases) {
        console.log(`▶ テストケース生成中: ${tc.name}`);
        // ジェネレータエンジン(400桁設定)で根から係数へ展開
        const exactCoeffs = generateExactCoefficients(tc.roots);
        
        data.cases.push({
            name: tc.name,
            description: tc.description,
            degree: tc.roots.length,
            roots_expected: tc.roots,
            exact_coefficients: exactCoeffs
        });
        console.log(`  => 次数: ${tc.roots.length}, 係数生成完了`);
    }

    // JSONファイルとして書き出し
    const outputPath = path.resolve(__dirname, '../close-roots-test-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`\n[完了] 全5パターンのテストデータを保存しました: ${outputPath}`);
}

main();