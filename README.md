# Close Roots Coefficient Data Generator (JS Edition)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 1. プロジェクト概要
本プロジェクトは、数値解析・多項式求根アルゴリズム（特に MethodDka プロジェクト v3.4.0 以降）の堅牢性テストを目的とした**「近接根・多重根係数データジェネレータ」**の JavaScript (Node.js) 実装です。

10進数から2進数浮動小数点数への変換誤差や、近接根の展開計算時に発生する桁落ち（情報落ち）を意図的に再現し、極めて悪条件な多項式の係数を高精度に生成・出力します。

---

## 2. ソフトウェア開発要求仕様 (小泉嘉章方式AI仕様駆動開発)

### 2.1. 目的と背景
* **課題:** 通常の乱数生成による係数では、アルゴリズムの限界をテストするための「真の近接根」や「10進小数特有の変換誤差」を網羅的に検証することが困難である。
* **解決策:** ユーザーが指定した根の集合 $\{r_1, r_2, \dots, r_n\}$ から、任意精度演算を用いて正確な展開公式 $P(x) = \prod_{i=1}^{n} (x - r_i)$ を計算し、テスト用の係数データセットを自動生成する。

### 2.2. 機能要件 (Functional Requirements)
1. **任意精度演算エンジン:** `decimal.js` または同等の高精度演算ライブラリを統合し、係数展開時の意図しない丸め誤差を排除する。
2. **根のパターン設定機能:**
   * **Pattern A (2進数厳密表現):** $r_1 = 0.5$, $r_2 = 0.5 + 2^{-15}$ のように、2進数変換誤差を含まない純粋な桁落ち検証用データ。
   * **Pattern B (10進変換誤差):** $r_1 = 0.1$, $r_2 = 0.1 + 10^{-5}$ のように、無限循環小数による変換誤差と桁落ちの複合検証用データ。
   * **Wilkinson型:** 任意の間隔で配置された多数の根。
3. **データエクスポート:** 生成した多項式の次数、係数配列（実部・虚部）、および真の根のリストを JSON 形式で出力する。

### 2.3. 非機能要件 (Non-Functional Requirements)
* **動作環境:** Node.js (v18以降を推奨)。
* **ライセンス:** MIT License。完全なオープンソースとして公開。
* **拡張性:** 将来的なWebブラウザ上でのUI実行（React等）を見据え、コアの計算ロジックとCLI処理を分離したモジュール設計とする。

---

## 3. 入出力仕様

### 入力 (JSON Config または CLI引数)
* `degree`: 多項式の次数
* `roots`: 根の配列 または パターン指定 (`binary_exact`, `decimal_error`)
* `precision`: 内部計算の有効桁数 (例: `320`)

### 出力 (JSONフォーマット)
MethodDka CUI版 v3.4.0 に直接入力可能なフォーマットで出力します。
```json
{
  "test_case": "decimal_error_close_roots",
  "degree": 2,
  "roots": ["0.1", "0.10001"],
  "coefficients": {
    "a2": "1",
    "a1": "-0.20001",
    "a0": "0.010001"
  }
}
```

---

## 4. インストールと実行方法

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/method-dka-roots-generator-js.git
cd method-dka-roots-generator-js

# 依存関係のインストール
npm install

# CLIからの実行例
node src/cli.js --pattern decimal_error --delta 1e-5 --out result.json
```

## 5. ライセンス
This project is licensed under the MIT License - see the LICENSE file for details.

開発者
Yoshiaki　Koizumi
小泉　嘉章
