const Decimal = require('decimal.js');

// 精度の設定 (MethodDka v3.4.0の320桁前処理に対応できる程度の余裕を持つ400桁)
Decimal.set({ precision: 400, rounding: Decimal.ROUND_HALF_UP });

/**
 * 与えられた根の配列から多項式の係数を高精度で計算する
 * (x - r1)(x - r2)...(x - rn) = a_n * x^n + ... + a_0
 * @param {string[]} roots - 根の配列（文字列形式で精度を保持）
 * @returns {string[]} 係数の配列（高次から低次の順: a_n, a_{n-1}, ..., a_0）
 */
function generateExactCoefficients(roots) {
    // 初期状態は (1) つまり定数項 1
    // 係数配列は [定数項, xの係数, x^2の係数, ...] の順（低次から高次）で計算
    let coeffs = [new Decimal(1)];

    for (const rootStr of roots) {
        const r = new Decimal(rootStr);
        // 次の次数のために配列サイズを1つ増やす
        const newCoeffs = new Array(coeffs.length + 1).fill(new Decimal(0));

        // (x - r) を掛ける演算
        for (let i = 0; i < coeffs.length; i++) {
            // x を掛ける項 (次数が1上がる)
            newCoeffs[i + 1] = newCoeffs[i + 1].plus(coeffs[i]);
            // -r を掛ける項 (次数はそのまま)
            newCoeffs[i] = newCoeffs[i].minus(coeffs[i].times(r));
        }
        coeffs = newCoeffs;
    }

    // MethodDka CUI版の入力仕様に合わせて、高次から低次の順 [a_n, a_{n-1}, ..., a_0] に反転して文字列化
    return coeffs.reverse().map(c => c.toString());
}

module.exports = {
    generateExactCoefficients
};