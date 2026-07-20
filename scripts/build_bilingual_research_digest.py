# -*- coding: utf-8 -*-
"""Create bilingual Chinese/English research digests for the TA expert database."""

from __future__ import annotations

import csv
import json
import sqlite3
import sys
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "technical_analysis_experts.sqlite"
SEED_JSON_PATH = DATA_DIR / "technical_analysis_experts_seed.json"

DIGEST_CSV_PATH = DATA_DIR / "technical_analysis_expert_research_digest_bilingual.csv"
MATERIALS_BILINGUAL_CSV_PATH = DATA_DIR / "technical_analysis_research_materials_bilingual.csv"
DIGEST_MD_PATH = DATA_DIR / "technical_analysis_expert_research_digest_bilingual.md"


CATEGORY_LABELS = {
    "foundation": ("理論奠基者", "Foundational theorist"),
    "practitioner": ("實戰交易代表", "Market practitioner"),
    "author": ("經典著作作者", "Classic author"),
    "author_researcher": ("著作與研究兼具", "Author-researcher"),
    "system_developer": ("交易系統開發者", "Trading-system developer"),
    "indicator_creator": ("技術指標創作者", "Indicator creator"),
    "researcher": ("技術研究者", "Technical researcher"),
    "author_practitioner": ("作者兼實戰交易者", "Author-practitioner"),
    "practitioner_author": ("實戰交易者兼作者", "Practitioner-author"),
    "indicator_specialist": ("指標專題專家", "Indicator specialist"),
    "educator": ("技術分析教育者", "Technical-analysis educator"),
    "charting_specialist": ("圖表方法專家", "Charting specialist"),
    "researcher_author": ("研究者兼作者", "Researcher-author"),
    "academic": ("學術研究者", "Academic researcher"),
    "academic_practitioner": ("學術與實務研究者", "Academic-practitioner"),
}


MATERIAL_TYPE_LABELS = {
    "archive": ("歷史檔案", "Archive"),
    "article": ("文章", "Article"),
    "book": ("書籍", "Book"),
    "book_series": ("系列書籍", "Book series"),
    "drawing_tool": ("繪圖工具/分析法", "Drawing tool / analytical method"),
    "editorials": ("市場評論", "Market editorials"),
    "historical_method": ("歷史方法", "Historical method"),
    "indicator": ("技術指標", "Technical indicator"),
    "indicator_library": ("指標庫", "Indicator library"),
    "method": ("交易方法", "Trading method"),
    "newsletter": ("市場通訊", "Market newsletter"),
    "paper": ("研究論文", "Research paper"),
    "source": ("參考來源", "Reference source"),
}


SOURCE_TYPE_LABELS = {
    "academic_paper": ("學術論文", "Academic paper"),
    "archive": ("檔案", "Archive"),
    "article": ("文章", "Article"),
    "award_or_professional": ("獎項/專業資料", "Award/professional source"),
    "award_research": ("獎項研究", "Award research"),
    "book_archive": ("書籍檔案", "Book archive"),
    "book_catalog": ("書目資料", "Book catalog"),
    "book_list": ("書單", "Book list"),
    "book_reference": ("書籍參考", "Book reference"),
    "chart_reference": ("圖表方法參考", "Chart reference"),
    "education": ("教育資料", "Educational source"),
    "encyclopedia": ("百科資料", "Encyclopedia"),
    "history": ("歷史資料", "Historical source"),
    "indicator_reference": ("指標參考", "Indicator reference"),
    "interview": ("訪談", "Interview"),
    "library_guide": ("圖書館指南", "Library guide"),
    "method_reference": ("方法參考", "Method reference"),
    "official": ("官方資料", "Official source"),
    "pattern_reference": ("型態參考", "Pattern reference"),
    "paper_reference": ("論文參考", "Paper reference"),
    "professional_profile": ("專業履歷", "Professional profile"),
    "research_summary": ("研究摘要", "Research summary"),
    "strategy_reference": ("策略參考", "Strategy reference"),
    "theory_reference": ("理論參考", "Theory reference"),
    "web_reference": ("網頁參考", "Web reference"),
}


EVIDENCE_LABELS = {
    "high": ("高：官方、書目、論文、CMT/專業來源或主要指標參考", "High: official, bibliographic, paper, CMT/professional, or primary indicator reference"),
    "medium": ("中：可靠網頁、百科、交易平台或二級整理來源", "Medium: reliable web, encyclopedia, platform, or secondary reference"),
}


FAMILY_APPLICATIONS = {
    "auction_market": ("拍賣市場結構、價值區與成交分佈判讀", "auction-market structure, value areas, and distribution analysis"),
    "breadth": ("市場寬度、內部強弱與指數健康度判讀", "market breadth, internal strength, and index health"),
    "breakout": ("突破、波動擴張與開盤區間交易", "breakouts, volatility expansion, and opening-range trading"),
    "charting": ("圖表型態、價格結構與支撐阻力", "chart patterns, price structure, and support/resistance"),
    "cycle": ("週期、時間窗口與市場節奏判讀", "cycles, timing windows, and market rhythm"),
    "foundation": ("技術分析基本理論與市場趨勢框架", "core technical-analysis theory and trend frameworks"),
    "market_timing": ("市場時機、轉折與進出場判斷", "market timing, turns, and entry/exit decisions"),
    "momentum": ("動量、超買超賣、背離與趨勢強弱", "momentum, overbought/oversold conditions, divergence, and trend strength"),
    "research": ("實證檢驗、規則驗證與資料探勘風險控制", "empirical testing, rule validation, and data-mining control"),
    "risk": ("回撤、下行風險與資金管理", "drawdown, downside risk, and money management"),
    "sentiment": ("市場情緒、逆向指標與群眾心理", "sentiment, contrarian indicators, and crowd psychology"),
    "stock_selection": ("股票選股、相對強弱與成長股篩選", "stock selection, relative strength, and growth-stock screening"),
    "support_resistance": ("價格水平、通道、費波納契與支撐阻力", "price levels, channels, Fibonacci work, and support/resistance"),
    "systems": ("系統交易、規則設計與回測流程", "systematic trading, rule design, and backtesting"),
    "trend": ("趨勢辨識、均線、通道與趨勢跟隨", "trend identification, moving averages, channels, and trend following"),
    "uncategorized": ("其他技術分析方法", "other technical-analysis methods"),
    "volatility": ("波動率、通道寬度與風險環境", "volatility, channel width, and risk regimes"),
    "volume": ("量價關係、資金流與供需分析", "price-volume relationships, money flow, and supply/demand"),
    "wave": ("波浪、分形結構與時間價格路徑", "waves, fractal structure, and time-price paths"),
}


RELATION_TRANSLATIONS = {
    "創始者": "creator",
    "共同創始者": "co-creator",
    "創始/推廣者": "creator/promoter",
    "奠基者": "founder",
    "共同作者": "co-author",
    "主要詮釋者": "principal interpreter",
    "系統化整理者": "systematizer",
    "早期系統化作者": "early systematizing author",
    "早期趨勢概念": "early trend concept",
    "趨勢判讀": "trend interpretation",
    "趨勢確認": "trend confirmation",
    "趨勢交易": "trend trading",
    "趨勢跟隨": "trend following",
    "趨勢跟隨先驅": "trend-following pioneer",
    "趨勢反轉": "trend reversal",
    "長期趨勢": "long-term trend analysis",
    "長期市場判斷": "long-term market judgment",
    "市場趨勢": "market trend analysis",
    "系統化趨勢": "systematic trend analysis",
    "型態分析": "pattern analysis",
    "型態統計": "pattern statistics",
    "歷史樣本統計": "historical sample statistics",
    "圖表型態": "chart-pattern work",
    "型態與趨勢線": "patterns and trendlines",
    "K 線型態": "candlestick patterns",
    "M/W 型態": "M/W patterns",
    "Narrow Range 型態": "Narrow Range pattern",
    "2B 型態": "2B pattern",
    "1-2-3 反轉": "1-2-3 reversal",
    "箱型理論": "box theory",
    "突破交易": "breakout trading",
    "突破量能": "breakout volume",
    "價格行為": "price action",
    "價格量能": "price and volume action",
    "價格叢集": "price clusters",
    "價格時間分佈": "time-price distribution",
    "時間價格": "time and price analysis",
    "時間價格專家": "time-price specialist",
    "波浪/時間價格": "wave/time-price work",
    "波浪/時間": "wave and timing work",
    "波浪規則": "wave rules",
    "市場結構": "market structure",
    "市場歷史": "market history",
    "市場分析": "market analysis",
    "市場技術史": "technical market history",
    "市場指標": "market indicators",
    "市場寬度": "market breadth",
    "成交量廣度": "volume breadth",
    "量價分析": "price-volume analysis",
    "量價/資金流": "price-volume / money-flow analysis",
    "量價動量": "price-volume momentum",
    "量價研究": "price-volume research",
    "量價差": "volume-spread analysis",
    "供需/量價": "supply/demand and price-volume work",
    "資金管理": "money management",
    "基金現金/市場指標": "mutual-fund cash / market indicators",
    "市場心理": "market psychology",
    "情緒/心理指標": "sentiment/psychology indicators",
    "情緒指標": "sentiment indicators",
    "情緒模型": "sentiment models",
    "社會情緒與市場": "social mood and markets",
    "逆向思考": "contrarian thinking",
    "市場底部": "market bottoms",
    "熊市底部研究": "bear-market bottom research",
    "長期底部/頂部": "long-term tops/bottoms",
    "市場警訊": "market warning signals",
    "市場健康": "market health",
    "市場備忘錄": "market memos",
    "市場時機": "market timing",
    "代表性實踐者": "representative practitioner",
    "經典作者": "classic author",
    "經典教材作者": "classic textbook author",
    "經典教材共同作者": "classic textbook co-author",
    "教材作者": "textbook author",
    "指標與教材作者": "indicator and textbook author",
    "百科作者": "encyclopedia author",
    "研究者": "researcher",
    "統計研究者": "statistical researcher",
    "學術研究": "academic research",
    "統計研究": "statistical research",
    "統計分析": "statistical analysis",
    "統計推論": "statistical inference",
    "量化市場研究": "quantitative market research",
    "量化規則": "quantitative rules",
    "歷史統計": "historical statistics",
    "資料探勘校正": "data-mining adjustment",
    "實證技術分析": "evidence-based technical analysis",
    "缺口策略研究": "gap-strategy research",
    "Dow Award 研究": "Dow Award research",
    "Dow Award 得主": "Dow Award winner",
    "選股研究": "stock-selection research",
    "成長股選股": "growth-stock selection",
    "成長股型態": "growth-stock pattern work",
    "強勢股": "relative-strength stocks",
    "SEPA 強勢股": "SEPA relative-strength stocks",
    "相對/絕對動量": "relative/absolute momentum",
    "雙動量": "dual momentum",
    "產業趨勢": "industry trends",
    "短線交易": "short-term trading",
    "短線策略": "short-term strategies",
    "短線動量": "short-term momentum",
    "短線改良": "short-term modification",
    "短線均值回歸": "short-term mean reversion",
    "高勝率策略": "high-probability strategies",
    "交易系統": "trading systems",
    "交易系統作者": "trading-system author",
    "系統交易作者": "systematic-trading author",
    "交易方法整理": "trading-method compilation",
    "交易者訪談": "trader interviews",
    "策略測試": "strategy testing",
    "系統測試": "system testing",
    "策略驗證": "strategy validation",
    "樣本外驗證": "out-of-sample validation",
    "客觀規則": "objective rules",
    "三大交易技能": "three trading skills",
    "推廣者/作者": "promoter/author",
    "推廣/定義者": "promoter/definer",
    "教育者": "educator",
    "西方推廣者": "Western popularizer",
    "歷史源流": "historical origin",
    "長期推廣者": "long-term promoter",
    "現代推廣者": "modern promoter",
    "現代改編者": "modern adapter",
    "現代教材作者": "modern textbook author",
    "威科夫衍生": "Wyckoff-derived method",
    "指標彙整": "indicator compendium",
    "指標組合": "indicator combination",
    "進階詮釋者": "advanced interpreter",
    "正/負反轉與區間規則": "positive/negative reversals and range rules",
    "Composite Index": "Composite Index",
    "動量均線": "momentum moving average",
    "動量先行觀念": "momentum-leading concept",
    "動量研究": "momentum research",
    "長期動量": "long-term momentum",
    "多週期動量": "multi-timeframe momentum",
    "商品週期": "commodity cycles",
    "景氣/市場循環": "business/market cycles",
    "市場循環": "market cycles",
    "週期分析": "cycle analysis",
    "DSP 週期分析": "DSP cycle analysis",
    "濾波器": "filters",
    "自適應指標": "adaptive indicators",
    "自適應平滑": "adaptive smoothing",
    "低滯後均線": "low-lag moving averages",
    "多均線趨勢": "multiple moving-average trend work",
    "三重平滑動量": "triple-smoothed momentum",
    "波動通道": "volatility bands",
    "波動擴張": "volatility expansion",
    "波動/風險": "volatility/risk",
    "波動標準化動量": "volatility-normalized momentum",
    "下行風險": "downside risk",
    "新低數研究": "new-lows research",
    "ATR 通道應用": "ATR channel application",
    "角度/價位": "angles/price levels",
    "趨勢/支撐阻力": "trend and support/resistance",
    "中線/通道": "median lines/channels",
    "擺動點": "swing points",
    "趨勢線": "trendlines",
    "價值區": "value area",
    "開盤區間": "opening range",
    "Pivot range": "Pivot range",
    "DiNapoli Levels": "DiNapoli Levels",
    "Filtered Waves": "Filtered Waves",
    "Weis Wave": "Weis Wave",
    "3-box reversal 推廣者": "3-box reversal promoter",
    "Bullish Percent": "Bullish Percent",
    "P&F 相對強弱": "P&F relative strength",
    "P&F 結合指標": "P&F-integrated indicator work",
    "拍賣市場邏輯": "auction-market logic",
    "計算型型態識別": "computational pattern recognition",
    "Anchored VWAP 推廣者": "Anchored VWAP promoter",
    "多週期分析": "multi-timeframe analysis",
    "讀帶": "tape reading",
    "MACD-V": "MACD-V",
    "Triple Screen": "Triple Screen",
}


TITLE_ZH_OVERRIDES = {
    "Wall Street Journal editorials on market averages": "《華爾街日報》市場平均指數評論",
    "The Stock Market Barometer": "《股票市場晴雨表》",
    "The Dow Theory": "《道氏理論》",
    "Studies in Tape Reading": "《讀帶研究》",
    "How I Trade and Invest in Stocks and Bonds": "《我如何交易與投資股票和債券》",
    "How to Trade in Stocks": "《如何交易股票》",
    "Truth of the Stock Tape": "《股市讀帶真相》",
    "45 Years in Wall Street": "《華爾街四十五年》",
    "The Wave Principle": "《波浪原理》",
    "Technical Analysis and Stock Market Profits": "《技術分析與股市獲利》",
    "Technical Analysis of Stock Trends": "《股票趨勢技術分析》",
    "Technical Analysis of the Financial Markets": "《金融市場技術分析》",
    "Technical Analysis Explained": "《技術分析詳解》",
    "Getting Started in Technical Analysis": "《技術分析入門》",
    "Technical Analysis: The Complete Resource for Financial Market Technicians": "《技術分析：金融市場技術分析師完整資源》",
    "Technical Analysis from A to Z": "《技術分析 A 到 Z》",
    "The Encyclopedia of Technical Market Indicators": "《技術市場指標百科全書》",
    "Trading Systems and Methods": "《交易系統與方法》",
    "Smarter Trading": "《更聰明的交易》",
    "New Concepts in Technical Trading Systems": "《技術交易系統新概念》",
    "Technical Analysis: Power Tools for Active Investors": "《技術分析：主動投資者的強力工具》",
    "Bollinger on Bollinger Bands": "《布林格談布林通道》",
    "The New Technical Trader": "《新技術交易者》",
    "How I Made One Million Dollars Last Year Trading Commodities": "《我去年如何交易商品賺進一百萬美元》",
    "Granville's New Key to Stock Market Profits": "《格蘭維爾股市獲利新鑰》",
    "Patterns for Profit": "《獲利型態》",
    "The New Science of Technical Analysis": "《技術分析新科學》",
    "Trading for a Living": "《以交易為生》",
    "Japanese Candlestick Charting Techniques": "《日本蠟燭圖技術》",
    "Ichimoku Kinko Hyo": "《一目均衡表》",
    "Encyclopedia of Chart Patterns": "《圖表型態百科全書》",
    "Market Magic: Riding the Greatest Bull Market of the Century": "《市場魔法》",
    "The Fourth Mega-Market": "《第四次超級市場》",
    "Elliott Wave Principle": "《艾略特波浪原理》",
    "Mastering Elliott Wave": "《精通艾略特波浪》",
    "Secrets for Profiting in Bull and Bear Markets": "《牛熊市場獲利祕訣》",
    "How to Make Money in Stocks": "《如何在股票中賺錢》",
    "Trade Like a Stock Market Wizard": "《像股市魔法師一樣交易》",
    "Think and Trade Like a Champion": "《像冠軍一樣思考與交易》",
    "How I Made $2,000,000 in the Stock Market": "《我如何在股市賺到二百萬美元》",
    "Technical Analysis Using Multiple Timeframes": "《多時間框架技術分析》",
    "Maximum Trading Gains with Anchored VWAP": "《用 Anchored VWAP 提高交易收益》",
    "Street Smarts": "《街頭智慧交易策略》",
    "Short Term Trading Strategies That Work": "《有效的短線交易策略》",
    "Technical Analysis for the Trading Professional": "《專業交易者技術分析》",
    "Rocket Science for Traders": "《交易者的火箭科學》",
    "Cybernetic Analysis for Stocks and Futures": "《股票與期貨控制論分析》",
    "Cybernetic Trading Strategies": "《控制論交易策略》",
    "Design, Testing, and Optimization of Trading Systems": "《交易系統設計、測試與最佳化》",
    "Quantitative Trading Systems": "《量化交易系統》",
    "Modeling Trading System Performance": "《交易系統績效建模》",
    "Trading Systems That Work": "《有效的交易系統》",
    "Trading Tactics": "《交易戰術》",
    "The Investor's Guide to Fidelity Funds": "《富達基金投資指南》",
    "The Vortex Indicator": "《Vortex 指標》",
    "The Three Skills of Top Trading": "《頂尖交易的三項技能》",
    "Trades About to Happen": "《即將發生的交易》",
    "Master the Markets": "《掌握市場》",
    "How to Use the Three-Point Reversal Method of Point & Figure Stock Market Trading": "《如何使用點數圖三點反轉法交易股票》",
    "Point & Figure Charting": "《點數圖分析》",
    "The Definitive Guide to Point and Figure": "《點數圖權威指南》",
    "21st Century Point and Figure": "《二十一世紀點數圖》",
    "Markets and Market Logic": "《市場與市場邏輯》",
    "Steidlmayer on Markets": "《史戴梅爾談市場》",
    "Mind Over Markets": "《市場之上》",
    "Markets in Profile": "《市場輪廓》",
    "The Logical Trader": "《邏輯交易者》",
    "Day Trading with Short Term Price Patterns and Opening Range Breakout": "《短線價格型態與開盤區間突破日內交易》",
    "Trader Vic: Methods of a Wall Street Master": "《Trader Vic：華爾街大師的方法》",
    "Dynamic Trading": "《動態交易》",
    "Fibonacci Trading": "《費波納契交易》",
    "DiNapoli Levels": "《DiNapoli 水平》",
    "Filtered Waves: Basic Theory": "《過濾波浪：基本理論》",
    "Behavior of Prices on Wall Street": "《華爾街價格行為》",
    "Tape Reading and Market Tactics": "《讀帶與市場戰術》",
    "The Art of Contrary Thinking": "《逆向思考的藝術》",
    "Deemer on Technical Analysis": "《迪默談技術分析》",
    "Being Right or Making Money": "《做對判斷或賺到錢》",
    "The Research Driven Investor": "《研究驅動型投資者》",
    "Investing with Volume Analysis": "《成交量分析投資法》",
    "The Mathematics of Money Management": "《資金管理數學》",
    "Dual Momentum Investing": "《雙動量投資》",
    "Foundations of Technical Analysis": "《技術分析基礎》",
    "The Evolution of Technical Analysis": "《技術分析的演進》",
    "Evidence-Based Technical Analysis": "《實證技術分析》",
}


def configure_stdout():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def load_seed():
    return json.loads(SEED_JSON_PATH.read_text(encoding="utf-8"))


def join_items(items, lang):
    if not items:
        return ""
    sep = "；" if lang == "zh" else "; "
    return sep.join(items)


def get_research_materials():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = [
        dict(row)
        for row in conn.execute(
            """
            SELECT
                rm.*,
                e.rank AS expert_rank,
                e.name_zh AS expert_zh,
                e.name_en AS expert_en
            FROM research_materials rm
            JOIN experts e ON e.id = rm.expert_id
            ORDER BY e.rank, rm.material_type, rm.year, rm.title
            """
        )
    ]
    conn.close()
    by_expert = defaultdict(list)
    for row in rows:
        by_expert[row["expert_id"]].append(row)
    return rows, by_expert


def get_concept_lookup(seed):
    return {
        slug: {"name_zh": values[0], "name_en": values[1], "family": values[2]}
        for slug, values in seed["concepts"].items()
    }


def category_label(category, lang):
    labels = CATEGORY_LABELS.get(category, (category, category.replace("_", " ")))
    return labels[0] if lang == "zh" else labels[1]


def material_type_label(material_type, lang):
    labels = MATERIAL_TYPE_LABELS.get(material_type, (material_type, material_type.replace("_", " ").title()))
    return labels[0] if lang == "zh" else labels[1]


def source_type_label(source_type, lang):
    labels = SOURCE_TYPE_LABELS.get(source_type, (source_type, source_type.replace("_", " ").title()))
    return labels[0] if lang == "zh" else labels[1]


def evidence_label(level, lang):
    labels = EVIDENCE_LABELS.get(level or "", (level or "", level or ""))
    return labels[0] if lang == "zh" else labels[1]


def relation_en(relation):
    return RELATION_TRANSLATIONS.get(relation, relation)


def title_zh(title):
    if title in TITLE_ZH_OVERRIDES:
        return TITLE_ZH_OVERRIDES[title]
    if title.startswith("http"):
        return "參考來源：" + title
    return "原文題名：" + title


def title_en(title):
    if title.startswith("http"):
        return "Reference source: " + title
    return title


def material_title_pair(row):
    title = row["title"]
    if row["material_type"] == "source" and row.get("source_title") and not title.startswith("http"):
        title = row["source_title"]
    return title_zh(title), title_en(title)


def concept_strings(expert, concept_lookup):
    zh_parts = []
    en_parts = []
    family_zh = []
    family_en = []
    seen_families = set()
    for item in expert["concepts"]:
        concept = concept_lookup.get(item["slug"], {"name_zh": item["slug"], "name_en": item["slug"], "family": "uncategorized"})
        zh_parts.append(f"{concept['name_zh']}（{item['relation']}）")
        en_parts.append(f"{concept['name_en']} ({relation_en(item['relation'])})")
        family = concept["family"]
        if family not in seen_families:
            seen_families.add(family)
            app_zh, app_en = FAMILY_APPLICATIONS.get(family, FAMILY_APPLICATIONS["uncategorized"])
            family_zh.append(app_zh)
            family_en.append(app_en)
    return zh_parts, en_parts, family_zh, family_en


def representative_materials(materials):
    primary = [row for row in materials if row["material_type"] != "source"]
    primary.sort(key=lambda row: (row["year"] is None, row["year"] or 9999, row["title"]))
    if len(primary) < 3:
        primary.extend(row for row in materials if row["material_type"] == "source")
    return primary[:4]


def make_digest_rows(seed, materials_by_expert):
    concept_lookup = get_concept_lookup(seed)
    rows = []
    for expert in seed["experts"]:
        expert_id = slugify(expert["name_en"])
        materials = materials_by_expert.get(expert_id, [])
        reps = representative_materials(materials)
        concept_zh, concept_en, apps_zh, apps_en = concept_strings(expert, concept_lookup)

        rep_zh = []
        rep_en = []
        for material in reps:
            zh, en = material_title_pair(material)
            year = f"（{material['year']}）" if material.get("year") else ""
            year_en = f" ({material['year']})" if material.get("year") else ""
            rep_zh.append(f"{zh}{year}")
            rep_en.append(f"{en}{year_en}")

        material_count = len(materials)
        source_count = len({row["source_url"] for row in materials if row.get("source_url")})
        high_count = sum(1 for row in materials if row.get("evidence_level") == "high")
        book_count = sum(1 for row in materials if row.get("material_type") in {"book", "book_series"})
        paper_count = sum(1 for row in materials if row.get("material_type") in {"paper", "article"})

        summary_zh = (
            f"{expert['name_zh']}（{expert['name_en']}）定位為{category_label(expert['category'], 'zh')}。"
            f"研究/貢獻重點集中在{join_items(concept_zh, 'zh')}。"
            f"代表資料包括{join_items(rep_zh, 'zh')}。"
            f"可用於{join_items(apps_zh, 'zh')}。"
        )
        summary_en = (
            f"{expert['name_en']} ({expert['name_zh']}) is classified as a {category_label(expert['category'], 'en')}. "
            f"The research/contribution focus is {join_items(concept_en, 'en')}. "
            f"Representative materials include {join_items(rep_en, 'en')}. "
            f"The work is useful for {join_items(apps_en, 'en')}."
        )

        rows.append(
            {
                "rank": expert["rank"],
                "expert_id": expert_id,
                "name_zh": expert["name_zh"],
                "name_en": expert["name_en"],
                "country_region": expert["country_region"],
                "years": expert["years"],
                "category": expert["category"],
                "category_zh": category_label(expert["category"], "zh"),
                "category_en": category_label(expert["category"], "en"),
                "concepts_zh": join_items(concept_zh, "zh"),
                "concepts_en": join_items(concept_en, "en"),
                "research_focus_zh": join_items(apps_zh, "zh"),
                "research_focus_en": join_items(apps_en, "en"),
                "representative_materials_zh": join_items(rep_zh, "zh"),
                "representative_materials_en": join_items(rep_en, "en"),
                "contribution_summary_zh": expert["why_selected_zh"],
                "contribution_summary_en": summary_en,
                "bilingual_research_summary_zh": summary_zh,
                "bilingual_research_summary_en": summary_en,
                "material_count": material_count,
                "source_count": source_count,
                "high_evidence_count": high_count,
                "book_count": book_count,
                "paper_article_count": paper_count,
                "evidence_profile_zh": f"{material_count} 筆研究材料；{source_count} 個不同來源；{high_count} 筆高證據等級；書籍 {book_count} 筆；論文/文章 {paper_count} 筆。",
                "evidence_profile_en": f"{material_count} research materials; {source_count} distinct sources; {high_count} high-evidence records; {book_count} book records; {paper_count} paper/article records.",
                "translation_status": "normalized bilingual summary",
            }
        )
    return rows


def slugify(value):
    import re

    value = value.lower().replace("&", " and ")
    return re.sub(r"[^a-z0-9]+", "-", value).strip("-")


def make_material_rows(materials, seed):
    concept_lookup = get_concept_lookup(seed)
    output = []
    for row in materials:
        concept_labels_zh = []
        concept_labels_en = []
        for slug in (row.get("concept_slugs") or "").split(";"):
            if not slug:
                continue
            concept = concept_lookup.get(slug, {"name_zh": slug, "name_en": slug})
            concept_labels_zh.append(concept["name_zh"])
            concept_labels_en.append(concept["name_en"])
        tzh, ten = material_title_pair(row)
        output.append(
            {
                "material_id": row["id"],
                "expert_rank": row["expert_rank"],
                "expert_zh": row["expert_zh"],
                "expert_en": row["expert_en"],
                "title_zh": tzh,
                "title_en": ten,
                "material_type": row["material_type"],
                "material_type_zh": material_type_label(row["material_type"], "zh"),
                "material_type_en": material_type_label(row["material_type"], "en"),
                "year": row["year"] or "",
                "concepts_zh": join_items(concept_labels_zh, "zh"),
                "concepts_en": join_items(concept_labels_en, "en"),
                "source_url": row["source_url"] or "",
                "source_title": row["source_title"] or "",
                "source_type": row["source_type"] or "",
                "source_type_zh": source_type_label(row["source_type"] or "", "zh"),
                "source_type_en": source_type_label(row["source_type"] or "", "en"),
                "doi": row["doi"] or "",
                "isbn13": row["isbn13"] or "",
                "openlibrary_key": row["openlibrary_key"] or "",
                "google_books_id": row["google_books_id"] or "",
                "evidence_level": row["evidence_level"] or "",
                "evidence_level_zh": evidence_label(row["evidence_level"] or "", "zh"),
                "evidence_level_en": evidence_label(row["evidence_level"] or "", "en"),
                "notes_zh": row["notes_zh"] or "",
                "notes_en": f"Research material linked to {row['expert_en']} for {join_items(concept_labels_en[:4], 'en')}.",
            }
        )
    return output


def write_csv(path, rows):
    if not rows:
        return
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def replace_sqlite_tables(digest_rows, material_rows):
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.executescript(
        """
        DROP VIEW IF EXISTS bilingual_indicator_digest;
        DROP TABLE IF EXISTS expert_research_digest_bilingual;
        DROP TABLE IF EXISTS research_materials_bilingual;

        CREATE TABLE expert_research_digest_bilingual (
            expert_id TEXT PRIMARY KEY REFERENCES experts(id) ON DELETE CASCADE,
            rank INTEGER NOT NULL,
            name_zh TEXT NOT NULL,
            name_en TEXT NOT NULL,
            country_region TEXT,
            years TEXT,
            category TEXT,
            category_zh TEXT,
            category_en TEXT,
            concepts_zh TEXT,
            concepts_en TEXT,
            research_focus_zh TEXT,
            research_focus_en TEXT,
            representative_materials_zh TEXT,
            representative_materials_en TEXT,
            contribution_summary_zh TEXT,
            contribution_summary_en TEXT,
            bilingual_research_summary_zh TEXT,
            bilingual_research_summary_en TEXT,
            material_count INTEGER,
            source_count INTEGER,
            high_evidence_count INTEGER,
            book_count INTEGER,
            paper_article_count INTEGER,
            evidence_profile_zh TEXT,
            evidence_profile_en TEXT,
            translation_status TEXT
        );

        CREATE TABLE research_materials_bilingual (
            material_id INTEGER PRIMARY KEY REFERENCES research_materials(id) ON DELETE CASCADE,
            expert_rank INTEGER,
            expert_zh TEXT,
            expert_en TEXT,
            title_zh TEXT,
            title_en TEXT,
            material_type TEXT,
            material_type_zh TEXT,
            material_type_en TEXT,
            year INTEGER,
            concepts_zh TEXT,
            concepts_en TEXT,
            source_url TEXT,
            source_title TEXT,
            source_type TEXT,
            source_type_zh TEXT,
            source_type_en TEXT,
            doi TEXT,
            isbn13 TEXT,
            openlibrary_key TEXT,
            google_books_id TEXT,
            evidence_level TEXT,
            evidence_level_zh TEXT,
            evidence_level_en TEXT,
            notes_zh TEXT,
            notes_en TEXT
        );
        """
    )

    conn.executemany(
        """
        INSERT INTO expert_research_digest_bilingual (
            rank, expert_id, name_zh, name_en, country_region, years, category,
            category_zh, category_en, concepts_zh, concepts_en, research_focus_zh,
            research_focus_en, representative_materials_zh, representative_materials_en,
            contribution_summary_zh, contribution_summary_en, bilingual_research_summary_zh,
            bilingual_research_summary_en, material_count, source_count, high_evidence_count,
            book_count, paper_article_count, evidence_profile_zh, evidence_profile_en,
            translation_status
        )
        VALUES (
            :rank, :expert_id, :name_zh, :name_en, :country_region, :years, :category,
            :category_zh, :category_en, :concepts_zh, :concepts_en, :research_focus_zh,
            :research_focus_en, :representative_materials_zh, :representative_materials_en,
            :contribution_summary_zh, :contribution_summary_en, :bilingual_research_summary_zh,
            :bilingual_research_summary_en, :material_count, :source_count, :high_evidence_count,
            :book_count, :paper_article_count, :evidence_profile_zh, :evidence_profile_en,
            :translation_status
        )
        """,
        digest_rows,
    )
    conn.executemany(
        """
        INSERT INTO research_materials_bilingual (
            material_id, expert_rank, expert_zh, expert_en, title_zh, title_en,
            material_type, material_type_zh, material_type_en, year, concepts_zh,
            concepts_en, source_url, source_title, source_type, source_type_zh,
            source_type_en, doi, isbn13, openlibrary_key, google_books_id,
            evidence_level, evidence_level_zh, evidence_level_en, notes_zh, notes_en
        )
        VALUES (
            :material_id, :expert_rank, :expert_zh, :expert_en, :title_zh, :title_en,
            :material_type, :material_type_zh, :material_type_en, :year, :concepts_zh,
            :concepts_en, :source_url, :source_title, :source_type, :source_type_zh,
            :source_type_en, :doi, :isbn13, :openlibrary_key, :google_books_id,
            :evidence_level, :evidence_level_zh, :evidence_level_en, :notes_zh, :notes_en
        )
        """,
        material_rows,
    )
    conn.executescript(
        """
        CREATE VIEW bilingual_indicator_digest AS
        SELECT
            c.slug AS concept_slug,
            c.name_zh AS concept_zh,
            c.name_en AS concept_en,
            d.rank,
            d.name_zh,
            d.name_en,
            ec.relation AS relation_zh,
            d.concepts_en,
            d.research_focus_zh,
            d.research_focus_en,
            d.representative_materials_zh,
            d.representative_materials_en,
            d.material_count,
            d.source_count
        FROM concepts c
        JOIN expert_concepts ec ON ec.concept_slug = c.slug
        JOIN expert_research_digest_bilingual d ON d.expert_id = ec.expert_id;
        """
    )
    conn.commit()
    conn.close()


def write_markdown(digest_rows):
    lines = [
        "# 股票技術分析專家研究歸納（中英雙語）",
        "",
        "本檔由 `scripts/build_bilingual_research_digest.py` 產生。每位專家均統一整理為：分類、主要指標/方法、代表研究材料、研究用途、證據覆蓋。",
        "",
        "## 索引",
        "",
        "| # | 專家 | Category | 主要研究 / Research Focus | 材料 | 來源 |",
        "|---:|---|---|---|---:|---:|",
    ]
    for row in digest_rows:
        lines.append(
            f"| {row['rank']} | {row['name_zh']} / {row['name_en']} | {row['category_zh']} / {row['category_en']} | {row['research_focus_zh']} / {row['research_focus_en']} | {row['material_count']} | {row['source_count']} |"
        )

    lines.extend(["", "## 詳細歸納", ""])
    for row in digest_rows:
        lines.extend(
            [
                f"### {row['rank']}. {row['name_zh']} / {row['name_en']}",
                "",
                f"- 中文摘要：{row['bilingual_research_summary_zh']}",
                f"- English summary: {row['bilingual_research_summary_en']}",
                f"- 代表材料：{row['representative_materials_zh']}",
                f"- Representative materials: {row['representative_materials_en']}",
                f"- 證據覆蓋：{row['evidence_profile_zh']}",
                f"- Evidence profile: {row['evidence_profile_en']}",
                "",
            ]
        )
    DIGEST_MD_PATH.write_text("\n".join(lines), encoding="utf-8")


def main():
    configure_stdout()
    seed = load_seed()
    materials, materials_by_expert = get_research_materials()
    digest_rows = make_digest_rows(seed, materials_by_expert)
    material_rows = make_material_rows(materials, seed)
    write_csv(DIGEST_CSV_PATH, digest_rows)
    write_csv(MATERIALS_BILINGUAL_CSV_PATH, material_rows)
    replace_sqlite_tables(digest_rows, material_rows)
    write_markdown(digest_rows)
    print(f"expert_digest_rows={len(digest_rows)}")
    print(f"material_bilingual_rows={len(material_rows)}")
    print(f"digest_csv={DIGEST_CSV_PATH}")
    print(f"materials_csv={MATERIALS_BILINGUAL_CSV_PATH}")
    print(f"markdown={DIGEST_MD_PATH}")


if __name__ == "__main__":
    main()
