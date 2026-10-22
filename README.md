```markdown
# MethodDka Roots Generator & Benchmark Suite

MethodDkaコアソルバー（v3.4.0以降）の限界性能を評価するための、超高精度・近接根/多重根ベンチマークデータ生成および自動テスト統合環境です。

---

## 🇯🇵 日本語版 (Japanese)

### 1. 概要 (Overview)
`method-dka-roots-generator-js` は、指定された任意の解（根）の組み合わせから、`decimal.js` の320桁精度演算を用いて「展開済みの多項式係数」を逆算・生成する CUI ツールです。

浮動小数点演算における2進数変換誤差を完全に排除するため、すべての係数は文字列（String）として生成・出力されます。生成されたデータは `method-dka-core` の `input.txt` インターフェースへ自動的にパイプされ、DKA法ソルバーの近接根分離性能やユン平方無因子分解の堅牢性を評価する「限界突破テストスイート」として機能します。

### 2. 🧪 限界突破テストスイート (Test Cases)
本システムは、MethodDka (v3.4.0) のアルゴリズム限界を検証するため、以下の全5パターンの過酷なテストケースを自動生成・検証します。

| パターン名 | 根の構成 | 検証目的 (限界テストの狙い) |
| :--- | :--- | :--- |
| **Pattern A (Binary Exact)** | `0.5`, `0.500030517578125` | 2進数で正確に表現できる根を使用し、浮動小数点変換ノイズを排除した純粋な「桁落ち・近接根分離性能」を検証。 |
| **Pattern B (Decimal Error)** | `0.1`, `0.10001` | 2進数変換時に無限循環小数となる数値をあえて使用し、Decimal.jsの文字列パースによる「変換誤差の完全遮断」を検証。 |
| **Pattern C (Ultra Close)** | `0.5`, `0.5000...0001` (距離 $10^{-50}$) | 根の距離を50桁目まで接近させる極限テスト。ユン平方無因子分解プロセスがこれを「重根」と誤認せずに独立分離できるかの限界を探る。 |
| **Pattern D (10x Multiple)** | `0.5` を 10個 (重複度 10) | 完全に一致する重根。ユン平方無因子分解が「重複度10の因子が1つ」として完璧に抽出できるかを検証。 |
| **Pattern E (High-degree)** | 1次〜8次の整数 ＋ `0.1`, `0.10001` | 10次方程式の中に近接根を紛れ込ませた複合テスト。高次多項式化における全体的な数値安定性とスケール機能を試す。 |

### 3. 入出力仕様 (I/O Specification)
1. **生成フェーズ (`npm start`)**:
   - 内部の根定義から320桁精度で多項式を展開し、`close-roots-test-data.json` を生成します。
2. **自動ベンチマーク (`npm run benchmark`)**:
   - JSONから係数配列を抽出し、隣接するコアディレクトリの `method-dka-core/input.txt` へ書き込みます。
   - `method-dka-core` のプロセスを自動起動します。
   - 実行後、`method-dka-core/output.txt` を読み込み、結果をコンソールに整形して出力します。

### 4. インストールと実行方法
#### 必須環境
- Node.js (v18以降推奨)
- 同一階層のディレクトリに `method-dka-core` リポジトリが存在すること。

#### インストール
```bash
npm install

```

#### テストデータ生成

```bash
npm start

```

#### 全自動ベンチマーク実行

```bash
npm run benchmark

```

---

## 🇬🇧 English Version

### Overview

`method-dka-roots-generator-js` is a CUI tool that reverse-calculates expanded polynomial coefficients from specified roots using `decimal.js` at 320-digit precision. It acts as an automated benchmark suite to evaluate the limit performance of the `method-dka-core` solver (v3.4.0+).

To eliminate binary conversion errors inherent in floating-point arithmetic, all coefficients are generated and passed as Strings. The tool automatically pipes these coefficients into `method-dka-core/input.txt` to test DKA separation performance and the robustness of Yun's square-free decomposition.

### 🧪 Limit Test Suite (Test Cases)

The suite generates 5 extreme limit test patterns:

1. **Pattern A (Binary Exact)**: Roots [0.5, 0.500030517578125]. Tests pure close-root separation without float conversion noise.
2. **Pattern B (Decimal Error)**: Roots [0.1, 0.10001]. Tests string-based decimal parsing accuracy against infinite binary decimals.
3. **Pattern C (Ultra Close)**: Roots distance $10^{-50}$. Tests if Yun's square-free decomposition incorrectly merges extremely close roots into a multiple root.
4. **Pattern D (10x Multiple)**: 10 roots of 0.5. Tests if Yun's decomposition flawlessly extracts a single factor of multiplicity 10.
5. **Pattern E (High-degree)**: 10th-degree polynomial mixed with close roots. Tests overall numerical stability and scaling.

### Usage

```bash
# 1. Install dependencies
npm install

# 2. Generate JSON test data
npm start

# 3. Run automated benchmark against method-dka-core
npm run benchmark

```

---

📜 **ライセンス ＆ 開発者情報 (License & Developer Information)**

* **開発者 (Developer)**: 小泉嘉章 (Yoshiaki Koizumi)
* **バージョン (Version)**: v1.0.0 (v3.4.0 Limit Test Suite)
* **ライセンス (License)**: MIT License

```