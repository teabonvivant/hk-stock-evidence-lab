# -*- coding: utf-8 -*-
"""Build the local technical-analysis expert database.

The data below is a curated first-pass research seed. It favors people who are
directly tied to technical indicators, classical chart methods, technical-analysis
books, CMT/Dow Award research, or evidence-based TA literature.
"""

from __future__ import annotations

import csv
import json
import re
import sqlite3
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "technical_analysis_experts.sqlite"
SEED_JSON_PATH = DATA_DIR / "technical_analysis_experts_seed.json"
EXPERT_CSV_PATH = DATA_DIR / "technical_analysis_experts.csv"
CONCEPT_CSV_PATH = DATA_DIR / "technical_analysis_expert_concepts.csv"
MARKDOWN_PATH = DATA_DIR / "technical_analysis_experts_index.md"


CONCEPTS = {
    "acd-method": ("ACD 開盤區間法", "ACD Method", "breakout"),
    "adaptive-moving-average": ("自適應均線", "Adaptive Moving Average", "trend"),
    "adx-dmi": ("ADX / DMI", "Average Directional Index / Directional Movement", "trend"),
    "andrew-pitchfork": ("安德魯分叉線", "Andrews' Pitchfork", "support_resistance"),
    "aroon": ("Aroon 指標", "Aroon", "trend"),
    "atr": ("ATR 平均真實波幅", "Average True Range", "volatility"),
    "backtesting": ("回測與系統驗證", "Backtesting", "research"),
    "bollinger-bands": ("布林通道", "Bollinger Bands", "volatility"),
    "breadth": ("市場寬度", "Market Breadth", "breadth"),
    "candlestick": ("K 線 / 蠟燭圖", "Candlestick Charting", "charting"),
    "can-slim": ("CAN SLIM", "CAN SLIM", "stock_selection"),
    "cci": ("CCI 商品通道指標", "Commodity Channel Index", "momentum"),
    "chaikin-money-flow": ("Chaikin 資金流", "Chaikin Money Flow", "volume"),
    "chart-patterns": ("圖表型態", "Chart Patterns", "charting"),
    "cmo": ("Chande 動量震盪器", "Chande Momentum Oscillator", "momentum"),
    "connors-rsi": ("Connors RSI", "ConnorsRSI", "momentum"),
    "coppock-curve": ("Coppock 曲線", "Coppock Curve", "momentum"),
    "cup-with-handle": ("杯柄形態", "Cup With Handle", "charting"),
    "cycle-analysis": ("週期分析", "Cycle Analysis", "cycle"),
    "demark-indicators": ("DeMark 指標", "DeMARK Indicators", "market_timing"),
    "donchian-channel": ("唐奇安通道", "Donchian Channel", "trend"),
    "dow-theory": ("道氏理論", "Dow Theory", "foundation"),
    "elder-ray": ("Elder-Ray", "Elder-Ray Index", "momentum"),
    "elliott-wave": ("艾略特波浪", "Elliott Wave", "wave"),
    "ehlers-filters": ("Ehlers 濾波器", "Ehlers Filters", "cycle"),
    "evidence-based-ta": ("實證技術分析", "Evidence-Based Technical Analysis", "research"),
    "fibonacci": ("費波納契時間/價格", "Fibonacci Time and Price", "support_resistance"),
    "force-index": ("Force Index", "Force Index", "volume"),
    "gann": ("江恩理論", "Gann Methods", "cycle"),
    "guppy-mma": ("Guppy 多重移動平均", "Guppy Multiple Moving Average", "trend"),
    "hull-ma": ("Hull 移動平均", "Hull Moving Average", "trend"),
    "ichimoku": ("一目均衡表", "Ichimoku Kinko Hyo", "trend"),
    "kama": ("KAMA 考夫曼自適應均線", "Kaufman Adaptive Moving Average", "trend"),
    "market-profile": ("Market Profile", "Market Profile", "auction_market"),
    "macd": ("MACD", "Moving Average Convergence/Divergence", "momentum"),
    "mcginley-dynamic": ("McGinley Dynamic", "McGinley Dynamic", "trend"),
    "mcclellan-oscillator": ("McClellan Oscillator", "McClellan Oscillator", "breadth"),
    "mfi": ("MFI 資金流量指標", "Money Flow Index", "volume"),
    "market_timing": ("市場時機", "Market Timing", "market_timing"),
    "momentum": ("動量", "Momentum", "momentum"),
    "moving-average": ("移動平均", "Moving Average", "trend"),
    "obv": ("OBV 能量潮", "On-Balance Volume", "volume"),
    "opening-range-breakout": ("開盤區間突破", "Opening Range Breakout", "breakout"),
    "parabolic-sar": ("Parabolic SAR", "Parabolic SAR", "trend"),
    "point-and-figure": ("點數圖", "Point and Figure", "charting"),
    "price-action": ("價格行為", "Price Action", "charting"),
    "relative-strength": ("相對強弱 / 強勢股篩選", "Relative Strength", "stock_selection"),
    "risk": ("風險 / 回撤", "Risk / Drawdown", "risk"),
    "rsi": ("RSI 相對強弱指數", "Relative Strength Index", "momentum"),
    "sentiment": ("市場情緒", "Sentiment", "sentiment"),
    "stage-analysis": ("四階段分析", "Stage Analysis", "trend"),
    "stochastic": ("隨機指標", "Stochastic Oscillator", "momentum"),
    "stochastic-rsi": ("隨機 RSI", "Stochastic RSI", "momentum"),
    "stock_selection": ("股票選股", "Stock Selection", "stock_selection"),
    "supertrend": ("SuperTrend", "SuperTrend", "trend"),
    "support-resistance": ("支撐阻力", "Support and Resistance", "charting"),
    "systems-trading": ("交易系統", "Trading Systems", "systems"),
    "tape-reading": ("讀帶 / 盤口判讀", "Tape Reading", "charting"),
    "tema-dema": ("DEMA / TEMA", "Double/Triple Exponential Moving Average", "trend"),
    "trend-following": ("趨勢跟隨", "Trend Following", "trend"),
    "trin-arms-index": ("TRIN / Arms Index", "Arms Index", "breadth"),
    "trix": ("TRIX", "Triple Exponential Average", "momentum"),
    "ulcer-index": ("Ulcer Index", "Ulcer Index", "risk"),
    "vcp": ("VCP 波動收縮形態", "Volatility Contraction Pattern", "charting"),
    "vidya": ("VIDYA 動態平均", "Variable Index Dynamic Average", "trend"),
    "volatility": ("波動率", "Volatility", "volatility"),
    "volume-analysis": ("成交量分析", "Volume Analysis", "volume"),
    "volume-spread-analysis": ("VSA 量價差分析", "Volume Spread Analysis", "volume"),
    "vortex-indicator": ("Vortex 指標", "Vortex Indicator", "trend"),
    "vwap": ("VWAP / Anchored VWAP", "VWAP / Anchored VWAP", "volume"),
    "williams-r": ("Williams %R", "Williams %R", "momentum"),
    "wyckoff-method": ("威科夫方法", "Wyckoff Method", "volume"),
}


SOURCE_CATALOG = {
    "https://cmtassociation.org/association/award-recognizing/charles-h-dow-award/": ("CMT Association - Charles H. Dow Award", "award_research"),
    "https://www.bollingerbands.com/": ("John Bollinger's Official Bollinger Band Website", "official"),
    "https://www.bollingercapital.com/team": ("Bollinger Capital Management - Team", "official"),
    "https://cmtassociation.org/presenter/gerald-appel/": ("CMT Association - Gerald Appel", "professional_profile"),
    "https://traders.com/documentation/feedbk_docs/2003/09/Abstracts_new/Interview/interview.html": ("Technical Analysis of Stocks & Commodities - Gerald Appel Interview", "interview"),
    "https://books.google.com/books/about/New_Concepts_in_Technical_Trading_System.html?id=WesJAQAAMAAJ": ("Google Books - New Concepts in Technical Trading Systems", "book_catalog"),
    "https://www.investopedia.com/terms/r/rsi.asp": ("Investopedia - Relative Strength Index", "indicator_reference"),
    "https://www.investopedia.com/trading/macd/": ("Investopedia - MACD: A Primer", "indicator_reference"),
    "https://www.investopedia.com/terms/s/stochasticoscillator.asp": ("Investopedia - Stochastic Oscillator", "indicator_reference"),
    "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/stochastic-oscillator-fast-slow-and-full": ("StockCharts ChartSchool - Stochastic Oscillator", "indicator_reference"),
    "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/aroon": ("StockCharts ChartSchool - Aroon", "indicator_reference"),
    "https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/cmo": ("Fidelity - Chande Momentum Oscillator", "indicator_reference"),
    "https://www.investopedia.com/terms/s/stochrsi.asp": ("Investopedia - Stochastic RSI", "indicator_reference"),
    "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/commodity-channel-index-cci": ("StockCharts ChartSchool - Commodity Channel Index", "indicator_reference"),
    "https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/williams-r": ("Fidelity - Williams %R", "indicator_reference"),
    "https://www.investopedia.com/terms/o/onbalancevolume.asp": ("Investopedia - On-Balance Volume", "indicator_reference"),
    "https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/cmf": ("Fidelity - Chaikin Money Flow", "indicator_reference"),
    "https://chaikinanalytics.com/": ("Chaikin Analytics", "official"),
    "https://www.tradingview.com/support/solutions/43000502348-money-flow-mfi/": ("TradingView - Money Flow Index", "indicator_reference"),
    "https://www.mcoscillator.com/learning_center/kb/mcclellan_oscillator/the_origin_story_of_the_mcclellan_oscillator/": ("McClellan Market Report - Origin Story", "official"),
    "https://www.investopedia.com/terms/m/mcclellanoscillator.asp": ("Investopedia - McClellan Oscillator", "indicator_reference"),
    "https://chartschool.stockcharts.com/table-of-contents/market-indicators/arms-index-trin": ("StockCharts ChartSchool - Arms Index TRIN", "indicator_reference"),
    "https://www.investopedia.com/terms/a/arms.asp": ("Investopedia - Arms Index", "indicator_reference"),
    "https://en.wikipedia.org/wiki/Coppock_curve": ("Wikipedia - Coppock Curve", "encyclopedia"),
    "https://demark.com/about/": ("DeMARK Analytics - About Tom DeMark", "official"),
    "https://demark.com/demark-indicators/": ("DeMARK Analytics - DeMARK Indicators", "official"),
    "https://www.investopedia.com/articles/trading/03/022603.asp": ("Investopedia - Elder-Ray Indicator", "indicator_reference"),
    "https://candlecharts.com/about-steve-nison/": ("Candlecharts - About Steve Nison", "official"),
    "https://www.investopedia.com/terms/i/ichimoku-cloud.asp": ("Investopedia - Ichimoku Cloud", "indicator_reference"),
    "https://www.swissquote.com/en-ch/private/inspire/blog/technical-analysis/what-ichimoku-kinko-hyo-trading-method": ("Swissquote - Ichimoku Kinko Hyo", "indicator_reference"),
    "https://thepatternsite.com/": ("ThePatternSite - Thomas Bulkowski", "official"),
    "https://www.amazon.com/Encyclopedia-Chart-Patterns-Thomas-Bulkowski/dp/0471668265": ("Amazon - Encyclopedia of Chart Patterns", "book_catalog"),
    "https://www.investopedia.com/articles/financial-theory/10/pioneers-technical-analysis.asp": ("Investopedia - Pioneers of Technical Analysis", "history"),
    "https://www.investopedia.com/terms/d/dowtheory.asp": ("Investopedia - Dow Theory", "theory_reference"),
    "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=58690": ("SSRN - William Peter Hamilton Dow Theory Track Record", "academic_paper"),
    "https://books.google.com/books/about/The_Dow_Theory.html?id=FO65ngEACAAJ": ("Google Books - Robert Rhea, The Dow Theory", "book_catalog"),
    "https://openlibrary.org/books/OL6279382M/The_Dow_theory": ("Open Library - The Dow Theory", "book_catalog"),
    "https://chartschool.stockcharts.com/table-of-contents/market-analysis/wyckoff-analysis-articles/the-wyckoff-method-a-tutorial": ("StockCharts ChartSchool - Wyckoff Method", "method_reference"),
    "https://chartschool.stockcharts.com/table-of-contents/chart-analysis/introduction-to-chart-patterns": ("StockCharts ChartSchool - Introduction to Chart Patterns", "chart_reference"),
    "https://harriman-house.com/authors/richard-schabacker/technical-analysis-and-stock-market-profits/9780857199164": ("Harriman House - Schabacker Technical Analysis and Stock Market Profits", "book_catalog"),
    "https://www.investopedia.com/top-7-technical-analysis-tools-4773275": ("Investopedia - Top Technical Analysis Tools", "indicator_reference"),
    "https://www.investopedia.com/articles/personal-finance/090916/top-5-books-learn-technical-analysis.asp": ("Investopedia - Top Books to Learn Technical Analysis", "book_list"),
    "https://guides.newman.baruch.cuny.edu/c.php?g=188442&p=1243542": ("Baruch College Research Guide - Popular Technical Analysis Books", "library_guide"),
    "https://www.mheducation.com/highered/mhp/product/encyclopedia-technical-market-indicators-second-edition.html": ("McGraw Hill - Encyclopedia of Technical Market Indicators", "book_catalog"),
    "https://trendspider.com/learning-center/what-is-the-kaufman-adaptive-moving-average/": ("TrendSpider - Kaufman Adaptive Moving Average", "indicator_reference"),
    "https://www.investopedia.com/donchian-channels-formula-8415235": ("Investopedia - Donchian Channels", "indicator_reference"),
    "https://en.wikipedia.org/wiki/Richard_Donchian": ("Wikipedia - Richard Donchian", "encyclopedia"),
    "https://www.investopedia.com/terms/c/cupandhandle.asp": ("Investopedia - Cup and Handle", "pattern_reference"),
    "https://www.investopedia.com/terms/c/canslim.asp": ("Investopedia - CANSLIM", "strategy_reference"),
    "https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/cup-with-handle": ("Fidelity - Cup With Handle", "pattern_reference"),
    "https://trendspider.com/learning-center/volatility-contraction-pattern-vcp/": ("TrendSpider - Volatility Contraction Pattern", "pattern_reference"),
    "https://www.investopedia.com/articles/investing/070715/trading-stage-analysis.asp": ("Investopedia - Stage Analysis", "method_reference"),
    "https://www.stageanalysis.net/": ("Stage Analysis - Stan Weinstein Method", "method_reference"),
    "https://books.google.com/books/about/Maximum_Trading_Gains_With_Anchored_VWAP.html?id=p3aCzwEACAAJ": ("Google Books - Maximum Trading Gains with Anchored VWAP", "book_catalog"),
    "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/connorsrsi": ("StockCharts ChartSchool - ConnorsRSI", "indicator_reference"),
    "https://www.amazon.com/Street-Smarts-Probability-Short-Term-Strategies/dp/0965046109": ("Amazon - Street Smarts", "book_catalog"),
    "https://www.mesasoftware.com/TechnicalArticles.htm": ("MESA Software - John Ehlers Technical Papers", "official"),
    "https://alanhull.com/the-hull-moving-average/": ("Alan Hull - The Hull Moving Average", "official"),
    "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/hull-moving-average-hma": ("StockCharts ChartSchool - Hull Moving Average", "indicator_reference"),
    "https://www.investopedia.com/terms/g/guppy-multiple-moving-average.asp": ("Investopedia - Guppy Multiple Moving Average", "indicator_reference"),
    "https://www.earn2trade.com/blog/mcginley-dynamic-indicator/": ("Earn2Trade - McGinley Dynamic", "indicator_reference"),
    "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/trix": ("StockCharts ChartSchool - TRIX", "indicator_reference"),
    "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/ulcer-index": ("StockCharts ChartSchool - Ulcer Index", "indicator_reference"),
    "https://www.investopedia.com/terms/v/vortex-indicator-vi.asp": ("Investopedia - Vortex Indicator", "indicator_reference"),
    "https://traders.com/documentation/feedbk_docs/2010/01/Botes.html": ("Technical Analysis of Stocks & Commodities - The Vortex Indicator", "article"),
    "https://www.tradingview.com/support/solutions/43000634738-supertrend/": ("TradingView - SuperTrend", "indicator_reference"),
    "https://www.investopedia.com/supertrend-indicator-7976167": ("Investopedia - SuperTrend Indicator", "indicator_reference"),
    "https://www.wyckoffanalytics.com/hank-pruden/": ("Wyckoff Analytics - Hank Pruden", "professional_profile"),
    "https://www.wyckoffanalytics.com/david-weis/": ("Wyckoff Analytics - David Weis", "professional_profile"),
    "https://books.google.com/books/about/Trades_About_to_Happen.html?id=IPw1CgAAQBAJ": ("Google Books - Trades About to Happen", "book_catalog"),
    "https://www.acmetrades.com/tom-williams": ("ACME Trades - Tom Williams", "professional_profile"),
    "https://www.tradeguider.com/resource_center1.asp": ("TradeGuider - Wyckoff VSA Resources", "official"),
    "https://chartschool.stockcharts.com/table-of-contents/chart-analysis/point-and-figure-charts/point-and-figure-basics/introduction-to-point-and-figure-charts": ("StockCharts ChartSchool - Point and Figure Charts", "chart_reference"),
    "https://www.investopedia.com/terms/p/pointandfigurechart.asp": ("Investopedia - Point-and-Figure Chart", "chart_reference"),
    "https://oxlive.dorseywright.com/university/faq.html": ("Nasdaq Dorsey Wright - Point & Figure University", "education"),
    "https://harriman-house.com/authors/jeremy-du-plessis/21st-century-point-and-figure/9780857194428": ("Harriman House - Jeremy du Plessis", "book_catalog"),
    "https://www.profiletrading.com/about/": ("Profile Trading - Market Profile", "official"),
    "https://jimdaltontrading.com/books/": ("Jim Dalton Trading - Books", "official"),
    "https://www.investopedia.com/articles/technical/04/032404.asp": ("Investopedia - Spotting Breakouts as Easy as ACD", "method_reference"),
    "https://www.investopedia.com/articles/technical/04/040704.asp": ("Investopedia - ACD System", "method_reference"),
    "https://oxfordstrat.com/trading-strategies/toby-crabel-narrow-range-1/": ("Oxfordstrat - Toby Crabel Narrow Range Pattern", "research_summary"),
    "https://thepatternsite.com/2B.html": ("ThePatternSite - Trader Vic 2B Pattern", "pattern_reference"),
    "https://dynamictraders.com/dt-books/": ("Dynamic Traders - Robert Miner Books", "official"),
    "https://www.moneyshow.com/expert/ote17731/carolyn-boroden/": ("MoneyShow - Carolyn Boroden", "professional_profile"),
    "https://www.elliottwavetrader.net/analyst/Carolyn-Boroden": ("ElliottWaveTrader - Carolyn Boroden", "professional_profile"),
    "https://www.mql5.com/en/articles/3061": ("MQL5 - DiNapoli Trading System", "method_reference"),
    "https://www.investopedia.com/articles/forex/05/andrewspitchfork.asp": ("Investopedia - Andrews' Pitchfork", "indicator_reference"),
    "https://www.optuma.com/blog/pitchforks-part-1": ("Optuma - Median Line Analysis History", "method_reference"),
    "https://books.google.com/books/about/Tape_Reading_and_Market_Tactics.html?id=XuiREQAAQBAJ": ("Google Books - Tape Reading and Market Tactics", "book_catalog"),
    "https://www.walterdeemer.com/": ("Walter Deemer - Books on Technical Analysis", "official"),
    "https://deemermarketmemos.com/": ("Walter Deemer Market Memos Archive", "archive"),
    "https://www.lyadvisors.com/": ("Louise Yamada Technical Research Advisors", "official"),
    "https://cmtassociation.org/presenter/louise-yamada/": ("CMT Association - Louise Yamada", "professional_profile"),
    "https://www.nyif.com/faculties/acampora-ralph": ("New York Institute of Finance - Ralph Acampora", "professional_profile"),
    "https://info.ndr.com/ndr-signals/which-indicators-should-i-follow": ("Ned Davis Research - NDR Signals", "official"),
    "https://www.investopedia.com/articles/active-trading/042114/overbought-or-oversold-use-relative-strength-index-find-out.asp": ("Investopedia - RSI Buy and Sell Signals", "indicator_reference"),
    "https://www.amazon.com/Technical-Analysis-Trading-Professional-Second/dp/007175914X": ("Amazon - Constance Brown Technical Analysis for the Trading Professional", "book_catalog"),
    "https://www.barchart.com/education/technical-indicators/cmb-composite-index": ("Barchart - Constance Brown Composite Index", "indicator_reference"),
    "https://www.linkedin.com/in/andrew-cardwell-b318099": ("LinkedIn - Andrew Cardwell", "professional_profile"),
    "https://www.investopedia.com/articles/active-trading/072115/understand-vortex-indicator-trading-strategies.asp": ("Investopedia - Vortex Indicator Trading Strategies", "indicator_reference"),
    "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/triple-exponential-moving-average-tema": ("StockCharts ChartSchool - TEMA", "indicator_reference"),
    "https://www.investopedia.com/ask/answers/041315/why-triple-exponential-moving-average-tema-important-traders-and-analysts.asp": ("Investopedia - TEMA", "indicator_reference"),
    "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=228099": ("SSRN - Foundations of Technical Analysis", "academic_paper"),
    "https://ideas.repec.org/p/nbr/nberwo/7613.html": ("RePEc - Foundations of Technical Analysis", "academic_paper"),
    "https://www.wiley.com/en-ca/Evidence-Based%2BTechnical%2BAnalysis%3A%2BApplying%2Bthe%2BScientific%2BMethod%2Band%2BStatistical%2BInference%2Bto%2BTrading%2BSignals-p-9780470008744": ("Wiley - Evidence-Based Technical Analysis", "book_catalog"),
    "https://www.amazon.com/Evidence-Based-Technical-Analysis-Scientific-Statistical/dp/0470008741": ("Amazon - Evidence-Based Technical Analysis", "book_catalog"),
    "https://www.santafe.edu/research/results/working-papers/simple-technical-trading-rules-and-the-stochastic-": ("Santa Fe Institute - Simple Technical Trading Rules", "academic_paper"),
    "https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-6261.1992.tb04681.x": ("Journal of Finance - Simple Technical Trading Rules", "academic_paper"),
    "https://en.wikipedia.org/wiki/Jesse_Livermore": ("Wikipedia - Jesse Livermore", "encyclopedia"),
    "https://en.wikipedia.org/wiki/William_Delbert_Gann": ("Wikipedia - W. D. Gann", "encyclopedia"),
    "https://en.wikipedia.org/wiki/Ralph_Nelson_Elliott": ("Wikipedia - Ralph Nelson Elliott", "encyclopedia"),
    "https://www.investopedia.com/terms/e/elliottwavetheory.asp": ("Investopedia - Elliott Wave Theory", "theory_reference"),
    "https://en.wikipedia.org/wiki/Munehisa_Homma": ("Wikipedia - Munehisa Homma", "encyclopedia"),
    "https://en.wikipedia.org/wiki/Robert_Prechter": ("Wikipedia - Robert Prechter", "encyclopedia"),
    "https://en.wikipedia.org/wiki/Richard_Russell_(Dow_Theory)": ("Wikipedia - Richard Russell", "encyclopedia"),
    "https://www.amazon.com/Elliott-Wave-Principle-Key-Market/dp/1616041374": ("Amazon - Elliott Wave Principle", "book_catalog"),
    "https://www.amazon.com/Mastering-Elliott-Wave-Glenn-Neely/dp/0930233441": ("Amazon - Mastering Elliott Wave", "book_catalog"),
    "https://en.wikipedia.org/wiki/Nicolas_Darvas": ("Wikipedia - Nicolas Darvas", "encyclopedia"),
    "https://www.amazon.com/Technical-Analysis-Stock-Trends-Edwards/dp/113806941X": ("Amazon - Technical Analysis of Stock Trends", "book_catalog"),
    "https://www.amazon.com/Technical-Analysis-Financial-Markets-Comprehensive/dp/0735200661": ("Amazon - Technical Analysis of the Financial Markets", "book_catalog"),
    "https://www.amazon.com/Technical-Analysis-Explained-Successful-Investment/dp/1260466020": ("Amazon - Technical Analysis Explained", "book_catalog"),
    "https://www.amazon.com/Getting-Started-Technical-Analysis-Schwager/dp/0471295426": ("Amazon - Getting Started in Technical Analysis", "book_catalog"),
    "https://www.fxcorporate.com/help/MS/LOGOUT/i_Vidya.html": ("FXCM / Marketscope Help - VIDYA", "indicator_reference"),
    "https://lindaraschke.net/recommended-reading/": ("Linda Raschke - Recommended Reading", "official"),
    "https://www.amazon.com/Filtered-Waves-Basic-Theory-Analysis/dp/0911894365": ("Amazon - Filtered Waves", "book_catalog"),
}


def work(title, year=None, work_type="book", url="", notes=""):
    return {"title": title, "year": year, "type": work_type, "url": url, "notes": notes}


def rec(rank, name, name_zh, country, years, role, category, concepts, works, why, scores, sources):
    return {
        "rank": rank,
        "name_en": name,
        "name_zh": name_zh,
        "country_region": country,
        "years": years,
        "role": role,
        "category": category,
        "concepts": [{"slug": slug, "relation": relation} for slug, relation in concepts],
        "works": works,
        "why_selected_zh": why,
        "scores": {
            "books_literature": scores[0],
            "papers_research": scores[1],
            "public_fame": scores[2],
            "indicator_specialist": scores[3],
            "stock_ta_focus": scores[4],
        },
        "sources": sources,
    }


EXPERTS = [
    rec(1, "Charles H. Dow", "查爾斯・道", "United States", "1851-1902", "金融記者、道氏理論奠基者", "foundation", [("dow-theory", "奠基者"), ("trend-following", "早期趨勢概念")], [work("Wall Street Journal editorials on market averages", 1899, "editorials")], "技術分析源流人物之一，道氏理論、趨勢確認與量價觀念皆由其市場評論發展而來。", (4, 4, 5, 5, 5), ["https://www.investopedia.com/terms/d/dowtheory.asp", "https://www.investopedia.com/articles/financial-theory/10/pioneers-technical-analysis.asp"]),
    rec(2, "William Peter Hamilton", "威廉・彼得・漢密爾頓", "United States", "1867-1929", "道氏理論實踐者、作家", "foundation", [("dow-theory", "主要詮釋者"), ("trend-following", "趨勢判讀")], [work("The Stock Market Barometer", 1922)], "把道氏理論用於實際市場評論與投資判斷，是早期技術分析史的重要承接者。", (4, 4, 4, 4, 5), ["https://papers.ssrn.com/sol3/papers.cfm?abstract_id=58690"]),
    rec(3, "Robert Rhea", "羅伯特・里亞", "United States", "1887-1939", "道氏理論作家、通訊作者", "foundation", [("dow-theory", "系統化整理者"), ("trend-following", "趨勢確認")], [work("The Dow Theory", 1932, url="https://books.google.com/books/about/The_Dow_Theory.html?id=FO65ngEACAAJ")], "以《The Dow Theory》整理 Dow 與 Hamilton 的觀念，對後來技術分析教材影響很深。", (4, 4, 4, 4, 5), ["https://books.google.com/books/about/The_Dow_Theory.html?id=FO65ngEACAAJ", "https://openlibrary.org/books/OL6279382M/The_Dow_theory"]),
    rec(4, "Richard D. Wyckoff", "理查・威科夫", "United States", "1873-1934", "市場操作者、教育者、作家", "foundation", [("wyckoff-method", "創始者"), ("volume-analysis", "量價分析"), ("tape-reading", "讀帶")], [work("Studies in Tape Reading", 1910), work("How I Trade and Invest in Stocks and Bonds", 1924)], "威科夫方法以供需、量價、累積/派發分析股票，是現代價格行為與量價交易的重要基礎。", (5, 4, 5, 5, 5), ["https://chartschool.stockcharts.com/table-of-contents/market-analysis/wyckoff-analysis-articles/the-wyckoff-method-a-tutorial"]),
    rec(5, "Jesse Livermore", "傑西・李佛摩", "United States", "1877-1940", "股票與商品交易者", "practitioner", [("tape-reading", "代表性實踐者"), ("price-action", "價格行為"), ("trend-following", "趨勢交易")], [work("How to Trade in Stocks", 1940)], "以價格行為、關鍵價位與趨勢操作聞名，雖非學院派作者，但對後世交易方法影響巨大。", (4, 2, 5, 3, 5), ["https://en.wikipedia.org/wiki/Jesse_Livermore"]),
    rec(6, "W. D. Gann", "威廉・江恩", "United States", "1878-1955", "交易者、作家", "foundation", [("gann", "創始者"), ("cycle-analysis", "週期分析"), ("support-resistance", "角度/價位")], [work("Truth of the Stock Tape", 1923), work("45 Years in Wall Street", 1941)], "江恩角度、時間循環、價格幾何在技術分析史上具代表性，適合歸於週期與時間價格分析資料。", (5, 2, 5, 5, 5), ["https://en.wikipedia.org/wiki/William_Delbert_Gann"]),
    rec(7, "Ralph Nelson Elliott", "拉爾夫・尼爾森・艾略特", "United States", "1871-1948", "會計師、波浪理論創始者", "foundation", [("elliott-wave", "創始者"), ("cycle-analysis", "市場循環")], [work("The Wave Principle", 1938)], "艾略特波浪是最知名的技術分析分支之一，常用於股票指數、外匯與商品的趨勢結構判讀。", (4, 3, 5, 5, 5), ["https://en.wikipedia.org/wiki/Ralph_Nelson_Elliott", "https://www.investopedia.com/terms/e/elliottwavetheory.asp"]),
    rec(8, "Richard W. Schabacker", "理查・沙巴克", "United States", "1899-1935", "金融編輯、技術分析作家", "author", [("chart-patterns", "早期系統化作者"), ("support-resistance", "型態與趨勢線")], [work("Technical Analysis and Stock Market Profits", 1932, url="https://harriman-house.com/authors/richard-schabacker/technical-analysis-and-stock-market-profits/9780857199164")], "把圖表型態、趨勢、支撐阻力整理成完整技術分析體系，並影響 Edwards 與 Magee。", (5, 3, 4, 4, 5), ["https://harriman-house.com/authors/richard-schabacker/technical-analysis-and-stock-market-profits/9780857199164", "https://chartschool.stockcharts.com/table-of-contents/chart-analysis/introduction-to-chart-patterns"]),
    rec(9, "Robert D. Edwards", "羅伯特・愛德華茲", "United States", "1893-1964", "技術分析作家", "author", [("chart-patterns", "經典教材作者"), ("support-resistance", "型態分析")], [work("Technical Analysis of Stock Trends", 1948, url="https://www.amazon.com/Technical-Analysis-Stock-Trends-Edwards/dp/113806941X")], "與 John Magee 合著的《Technical Analysis of Stock Trends》是圖表型態領域最常被引用的經典之一。", (5, 3, 5, 4, 5), ["https://www.amazon.com/Technical-Analysis-Stock-Trends-Edwards/dp/113806941X", "https://www.investopedia.com/articles/personal-finance/090916/top-5-books-learn-technical-analysis.asp"]),
    rec(10, "John Magee", "約翰・麥基", "United States", "1901-1987", "技術分析作家", "author", [("chart-patterns", "經典教材作者"), ("support-resistance", "型態分析")], [work("Technical Analysis of Stock Trends", 1948, url="https://www.amazon.com/Technical-Analysis-Stock-Trends-Edwards/dp/113806941X")], "與 Edwards 共同建立現代圖表型態教材框架，對股票技術分析教育影響深。", (5, 3, 5, 4, 5), ["https://www.amazon.com/Technical-Analysis-Stock-Trends-Edwards/dp/113806941X", "https://www.investopedia.com/articles/financial-theory/10/pioneers-technical-analysis.asp"]),
    rec(11, "John J. Murphy", "約翰・墨菲", "United States", "1942-", "技術分析師、作家", "author", [("moving-average", "教材作者"), ("chart-patterns", "教材作者"), ("breadth", "市場分析")], [work("Technical Analysis of the Financial Markets", 1999, url="https://www.amazon.com/Technical-Analysis-Financial-Markets-Comprehensive/dp/0735200661")], "綜合型技術分析教材代表作者，涵蓋趨勢、型態、指標、跨市場分析與期貨/股票應用。", (5, 4, 5, 4, 5), ["https://www.amazon.com/Technical-Analysis-Financial-Markets-Comprehensive/dp/0735200661", "https://www.investopedia.com/articles/personal-finance/090916/top-5-books-learn-technical-analysis.asp"]),
    rec(12, "Martin J. Pring", "馬丁・普林格", "United Kingdom / United States", "1943-", "技術分析師、作家", "author", [("momentum", "指標與教材作者"), ("cycle-analysis", "景氣/市場循環"), ("trend-following", "趨勢判讀")], [work("Technical Analysis Explained", 1980, url="https://www.amazon.com/Technical-Analysis-Explained-Successful-Investment/dp/1260466020")], "著作廣、教材地位高，特別適合整理動量、週期、趨勢與市場心理指標。", (5, 4, 5, 4, 5), ["https://www.amazon.com/Technical-Analysis-Explained-Successful-Investment/dp/1260466020", "https://www.investopedia.com/articles/personal-finance/090916/top-5-books-learn-technical-analysis.asp"]),
    rec(13, "Jack D. Schwager", "傑克・施瓦格", "United States", "1948-", "作家、基金與交易研究者", "author", [("chart-patterns", "教材作者"), ("systems-trading", "交易方法整理"), ("price-action", "交易者訪談")], [work("Getting Started in Technical Analysis", 1999, url="https://www.amazon.com/Getting-Started-Technical-Analysis-Schwager/dp/0471295426"), work("Market Wizards", 1989)], "技術分析入門書與 Market Wizards 訪談系列讓大量實戰交易方法被系統化保存。", (5, 3, 5, 3, 4), ["https://www.amazon.com/Getting-Started-Technical-Analysis-Schwager/dp/0471295426", "https://www.investopedia.com/articles/personal-finance/090916/top-5-books-learn-technical-analysis.asp"]),
    rec(14, "Charles D. Kirkpatrick II", "查爾斯・柯克派翠克二世", "United States", "", "CMT、作家、研究者", "author_researcher", [("relative-strength", "研究者"), ("dow-theory", "Dow Award 研究"), ("stock_selection", "選股研究")], [work("Technical Analysis: The Complete Resource for Financial Market Technicians", 2006), work("Stock Selection: A Test of Relative Stock Values Reported Over 17 1/2 Years", 2001, "paper")], "兼具 CMT 教材作者與 Charles H. Dow Award 研究紀錄，適合放入相對強弱與股票選股研究。", (5, 5, 4, 3, 5), ["https://cmtassociation.org/association/award-recognizing/charles-h-dow-award/"]),
    rec(15, "Julie R. Dahlquist", "茱莉・達爾奎斯特", "United States", "", "學者、CMT、教材作者", "author_researcher", [("chart-patterns", "教材作者"), ("backtesting", "缺口策略研究"), ("evidence-based-ta", "研究者")], [work("Technical Analysis: The Complete Resource for Financial Market Technicians", 2006), work("Analyzing Gaps for Profitable Trading Strategies", 2011, "paper")], "CMT 教材合著者與 Dow Award 得主，適合記錄缺口、教材與技術分析研究方法。", (5, 5, 4, 3, 5), ["https://cmtassociation.org/association/award-recognizing/charles-h-dow-award/"]),
    rec(16, "Steven B. Achelis", "史蒂文・阿契利斯", "United States", "", "技術指標百科作者、MetaStock 相關作者", "author", [("moving-average", "百科作者"), ("momentum", "百科作者"), ("volume-analysis", "百科作者")], [work("Technical Analysis from A to Z", 1995)], "以指標百科型著作著稱，對建立技術指標資料庫很有參考價值。", (5, 2, 4, 3, 5), ["https://guides.newman.baruch.cuny.edu/c.php?g=188442&p=1243542"]),
    rec(17, "Robert W. Colby", "羅伯特・科爾比", "United States", "", "技術指標百科作者", "author", [("moving-average", "百科作者"), ("momentum", "百科作者"), ("evidence-based-ta", "指標彙整")], [work("The Encyclopedia of Technical Market Indicators", 1988, url="https://www.mheducation.com/highered/mhp/product/encyclopedia-technical-market-indicators-second-edition.html")], "《The Encyclopedia of Technical Market Indicators》彙整大量指標，是資料庫型研究的重要來源。", (5, 3, 4, 3, 5), ["https://www.mheducation.com/highered/mhp/product/encyclopedia-technical-market-indicators-second-edition.html"]),
    rec(18, "Perry J. Kaufman", "佩里・考夫曼", "United States", "", "量化交易系統作者", "system_developer", [("kama", "創始者"), ("adaptive-moving-average", "創始者"), ("systems-trading", "系統交易作者")], [work("Trading Systems and Methods", 1978), work("Smarter Trading", 1995)], "在交易系統與自適應均線方面影響大，KAMA 是技術指標資料庫必收項。", (5, 4, 4, 5, 5), ["https://trendspider.com/learning-center/what-is-the-kaufman-adaptive-moving-average/"]),
    rec(19, "J. Welles Wilder Jr.", "威爾斯・威爾德", "United States", "1935-2021", "指標創作者、作家", "indicator_creator", [("rsi", "創始者"), ("adx-dmi", "創始者"), ("atr", "創始者"), ("parabolic-sar", "創始者")], [work("New Concepts in Technical Trading Systems", 1978, url="https://books.google.com/books/about/New_Concepts_in_Technical_Trading_System.html?id=WesJAQAAMAAJ")], "RSI、ADX/DMI、ATR、Parabolic SAR 等多個核心指標皆出自其 1978 年著作。", (5, 5, 5, 5, 5), ["https://books.google.com/books/about/New_Concepts_in_Technical_Trading_System.html?id=WesJAQAAMAAJ", "https://www.investopedia.com/terms/r/rsi.asp"]),
    rec(20, "Gerald Appel", "傑拉德・阿佩爾", "United States", "1933-2020", "技術分析師、作家、指標創作者", "indicator_creator", [("macd", "創始者"), ("moving-average", "動量均線")], [work("Technical Analysis: Power Tools for Active Investors", 2005)], "MACD 創作者，MACD 是全球交易平台中最普及的動量/趨勢指標之一。", (5, 4, 5, 5, 5), ["https://cmtassociation.org/presenter/gerald-appel/", "https://traders.com/documentation/feedbk_docs/2003/09/Abstracts_new/Interview/interview.html", "https://www.investopedia.com/trading/macd/"]),
    rec(21, "John Bollinger", "約翰・布林格", "United States", "1950-", "CFA、CMT、指標創作者", "indicator_creator", [("bollinger-bands", "創始者"), ("volatility", "波動通道")], [work("Bollinger on Bollinger Bands", 2001)], "布林通道創作者，對波動率自適應通道與相對高低位判讀具核心地位。", (5, 4, 5, 5, 5), ["https://www.bollingerbands.com/", "https://www.bollingercapital.com/team"]),
    rec(22, "George C. Lane", "喬治・藍恩", "United States", "1921-2004", "交易者、教育者、指標推廣者", "indicator_creator", [("stochastic", "創始/推廣者"), ("momentum", "動量先行觀念")], [work("Lane's Stochastics", None, "indicator")], "隨機指標代表人物；Stochastic 與 RSI、MACD 同屬最普及動量指標。", (3, 3, 5, 5, 5), ["https://www.investopedia.com/terms/s/stochasticoscillator.asp", "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/stochastic-oscillator-fast-slow-and-full"]),
    rec(23, "Richard Donchian", "理查・唐奇安", "United States", "1905-1993", "趨勢跟隨先驅、基金經理", "indicator_creator", [("donchian-channel", "創始者"), ("trend-following", "趨勢跟隨先驅")], [work("Commodity Trend Timing", 1960, "newsletter")], "被視為趨勢跟隨與管理期貨先驅，唐奇安通道是突破交易和 Turtle 系統的重要基礎。", (4, 3, 5, 5, 5), ["https://www.investopedia.com/donchian-channels-formula-8415235", "https://en.wikipedia.org/wiki/Richard_Donchian"]),
    rec(24, "Tushar S. Chande", "圖沙・昌德", "India / United States", "", "指標創作者、量化研究者", "indicator_creator", [("aroon", "創始者"), ("cmo", "創始者"), ("vidya", "創始者"), ("stochastic-rsi", "共同創始者")], [work("The New Technical Trader", 1994)], "Aroon、CMO、VIDYA、StochRSI 等多個指標與其相關，是技術指標資料庫的重點人物。", (5, 5, 4, 5, 5), ["https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/aroon", "https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/cmo", "https://www.investopedia.com/terms/s/stochrsi.asp"]),
    rec(25, "Stanley Kroll", "史丹利・克羅爾", "United States", "", "交易系統作者、指標共同作者", "indicator_creator", [("stochastic-rsi", "共同創始者"), ("vidya", "共同作者"), ("systems-trading", "交易系統")], [work("The New Technical Trader", 1994)], "與 Tushar Chande 合作提出 StochRSI 與相關動態指標方法。", (4, 3, 3, 4, 4), ["https://www.investopedia.com/terms/s/stochrsi.asp", "https://www.fxcorporate.com/help/MS/LOGOUT/i_Vidya.html"]),
    rec(26, "Donald R. Lambert", "唐納德・蘭伯特", "United States", "", "指標創作者", "indicator_creator", [("cci", "創始者"), ("cycle-analysis", "商品週期")], [work("Commodity Channel Index", 1980, "article")], "CCI 創作者；CCI 從商品週期工具延伸到股票、ETF、外匯等市場。", (3, 3, 4, 5, 5), ["https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/commodity-channel-index-cci"]),
    rec(27, "Larry Williams", "拉瑞・威廉斯", "United States", "1942-", "交易者、作家、指標創作者", "indicator_creator", [("williams-r", "創始者"), ("momentum", "短線動量"), ("breadth", "Dow Award 研究")], [work("How I Made One Million Dollars Last Year Trading Commodities", 1979), work("The Ripple Effect of Daily New Lows", 2024, "paper")], "Williams %R、Ultimate Oscillator 等工具與多本交易著作皆具影響力，亦為 2024 Dow Award 共同得主。", (5, 4, 5, 5, 5), ["https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/williams-r", "https://cmtassociation.org/association/award-recognizing/charles-h-dow-award/"]),
    rec(28, "Marc Chaikin", "馬克・柴金", "United States", "", "技術分析師、指標創作者", "indicator_creator", [("chaikin-money-flow", "創始者"), ("volume-analysis", "量價/資金流")], [work("Chaikin Money Flow", None, "indicator")], "Chaikin Money Flow 與 Chaikin 系列量價指標被廣泛內建於交易平台。", (3, 3, 4, 5, 5), ["https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/cmf", "https://chaikinanalytics.com/"]),
    rec(29, "Joseph Granville", "約瑟夫・格蘭維爾", "United States", "1923-2013", "市場通訊作者、指標創作者", "indicator_creator", [("obv", "創始者"), ("volume-analysis", "量價分析")], [work("Granville's New Key to Stock Market Profits", 1963)], "OBV 創作者，將成交量作為價格先行壓力的概念推廣到股票市場。", (4, 3, 5, 5, 5), ["https://www.investopedia.com/terms/o/onbalancevolume.asp"]),
    rec(30, "Sherman McClellan", "謝爾曼・麥克萊倫", "United States", "", "市場寬度指標創作者", "indicator_creator", [("mcclellan-oscillator", "共同創始者"), ("breadth", "市場寬度")], [work("Patterns for Profit", None)], "與 Marian McClellan 共同開發 McClellan Oscillator 與 Summation Index。", (3, 3, 4, 5, 5), ["https://www.mcoscillator.com/learning_center/kb/mcclellan_oscillator/the_origin_story_of_the_mcclellan_oscillator/", "https://www.investopedia.com/terms/m/mcclellanoscillator.asp"]),
    rec(31, "Marian McClellan", "瑪麗安・麥克萊倫", "United States", "", "市場寬度指標共同創作者", "indicator_creator", [("mcclellan-oscillator", "共同創始者"), ("breadth", "市場寬度")], [work("Patterns for Profit", None)], "McClellan Oscillator 共同創作者，對廣度動量與市場內部結構研究具代表性。", (3, 3, 4, 5, 5), ["https://www.mcoscillator.com/learning_center/kb/mcclellan_oscillator/the_origin_story_of_the_mcclellan_oscillator/", "https://www.investopedia.com/terms/m/mcclellanoscillator.asp"]),
    rec(32, "Richard W. Arms Jr.", "理查・阿姆斯", "United States", "1930-2018", "市場寬度指標創作者", "indicator_creator", [("trin-arms-index", "創始者"), ("breadth", "市場寬度"), ("volume-analysis", "成交量廣度")], [work("The Arms Index", 1967, "indicator")], "TRIN/Arms Index 將漲跌家數與成交量結合，是經典市場寬度與短線情緒工具。", (3, 3, 4, 5, 5), ["https://chartschool.stockcharts.com/table-of-contents/market-indicators/arms-index-trin", "https://www.investopedia.com/terms/a/arms.asp"]),
    rec(33, "Edwin S. Coppock", "艾德溫・科波克", "United States", "1918-1999", "經濟學家、指標創作者", "indicator_creator", [("coppock-curve", "創始者"), ("momentum", "長期動量")], [work("Coppock Curve", 1962, "indicator")], "Coppock Curve 是長期市場底部與月線動量判讀的經典工具。", (3, 3, 4, 5, 5), ["https://en.wikipedia.org/wiki/Coppock_curve"]),
    rec(34, "Tom DeMark", "湯姆・迪馬克", "United States", "", "指標創作者、機構顧問", "indicator_creator", [("demark-indicators", "創始者"), ("market_timing", "市場時機")], [work("The New Science of Technical Analysis", 1994), work("DeMARK Indicators", None, "indicator_library")], "DeMARK 指標系列在機構交易與市場時機判斷中知名度高，官方資料稱其為 DeMARK Indicators 創作者。", (5, 4, 5, 5, 5), ["https://demark.com/about/", "https://demark.com/demark-indicators/"]),
    rec(35, "Alexander Elder", "亞歷山大・艾爾德", "United States", "1950-", "交易者、心理醫師、作家", "indicator_creator", [("elder-ray", "創始者"), ("force-index", "創始者"), ("systems-trading", "Triple Screen")], [work("Trading for a Living", 1993)], "Elder-Ray、Force Index 與 Triple Screen 系統將趨勢、動量、量能與交易心理結合。", (5, 4, 5, 5, 5), ["https://www.investopedia.com/articles/trading/03/022603.asp"]),
    rec(36, "Steve Nison", "史蒂夫・尼森", "United States", "", "K 線技術分析作家", "author", [("candlestick", "西方推廣者"), ("chart-patterns", "K 線型態")], [work("Japanese Candlestick Charting Techniques", 1991)], "被其官方網站稱為把日本蠟燭圖帶入西方世界的權威，對全球 K 線教材影響極大。", (5, 3, 5, 5, 5), ["https://candlecharts.com/about-steve-nison/"]),
    rec(37, "Goichi Hosoda", "細田悟一", "Japan", "1898-1982", "一目均衡表創始者、記者", "indicator_creator", [("ichimoku", "創始者"), ("trend-following", "趨勢/支撐阻力")], [work("Ichimoku Kinko Hyo", 1969, "book_series")], "一目均衡表創始者，將趨勢、動量、支撐阻力與時間概念整合為完整系統。", (4, 3, 5, 5, 5), ["https://www.investopedia.com/terms/i/ichimoku-cloud.asp", "https://www.swissquote.com/en-ch/private/inspire/blog/technical-analysis/what-ichimoku-kinko-hyo-trading-method"]),
    rec(38, "Munehisa Homma", "本間宗久", "Japan", "1724-1803", "米商、蠟燭圖傳統人物", "foundation", [("candlestick", "歷史源流"), ("price-action", "市場心理")], [work("Sakata Rules", None, "historical_method")], "常被列為日本 K 線與市場心理分析源流人物；適合記錄在蠟燭圖歷史欄位。", (3, 2, 5, 4, 4), ["https://en.wikipedia.org/wiki/Munehisa_Homma"]),
    rec(39, "Thomas N. Bulkowski", "湯瑪斯・布考斯基", "United States", "", "圖表型態統計作者", "author_researcher", [("chart-patterns", "統計研究者"), ("candlestick", "型態統計"), ("backtesting", "歷史樣本統計")], [work("Encyclopedia of Chart Patterns", 2000, url="https://www.amazon.com/Encyclopedia-Chart-Patterns-Thomas-Bulkowski/dp/0471668265")], "以大量歷史樣本統計圖表型態與 K 線表現，是型態資料庫的重要參考人物。", (5, 4, 5, 4, 5), ["https://thepatternsite.com/", "https://www.amazon.com/Encyclopedia-Chart-Patterns-Thomas-Bulkowski/dp/0471668265"]),
    rec(40, "Louise Yamada", "路易絲・山田", "United States", "", "CMT、機構技術分析師", "practitioner", [("relative-strength", "機構技術研究"), ("trend-following", "長期趨勢"), ("support-resistance", "長期底部/頂部")], [work("Market Magic: Riding the Greatest Bull Market of the Century", 1998)], "前 Smith Barney/Citigroup 技術研究主管與 CMT Lifetime Achievement 得主，代表機構級技術分析。", (4, 3, 5, 3, 5), ["https://cmtassociation.org/presenter/louise-yamada/", "https://www.lyadvisors.com/"]),
    rec(41, "Ralph Acampora", "拉爾夫・阿坎波拉", "United States", "", "技術分析師、教育者", "practitioner", [("trend-following", "市場歷史"), ("chart-patterns", "教育者"), ("dow-theory", "市場技術史")], [work("The Fourth Mega-Market", 2000)], "被 NYIF 描述為華爾街受尊敬的技術分析師與市場歷史研究者，教育與業界影響力高。", (4, 3, 5, 3, 5), ["https://www.nyif.com/faculties/acampora-ralph"]),
    rec(42, "Robert Prechter", "羅伯特・普萊切特", "United States", "1949-", "艾略特波浪分析師、作家", "author", [("elliott-wave", "推廣者/作者"), ("sentiment", "社會情緒與市場")], [work("Elliott Wave Principle", 1978, url="https://www.amazon.com/Elliott-Wave-Principle-Key-Market/dp/1616041374")], "將艾略特波浪重新推廣成全球知名方法，與 A. J. Frost 合著經典教材。", (5, 4, 5, 4, 5), ["https://en.wikipedia.org/wiki/Robert_Prechter", "https://www.amazon.com/Elliott-Wave-Principle-Key-Market/dp/1616041374"]),
    rec(43, "A. J. Frost", "A・J・佛羅斯特", "Canada", "1908-1999", "艾略特波浪作者", "author", [("elliott-wave", "經典教材共同作者")], [work("Elliott Wave Principle", 1978, url="https://www.amazon.com/Elliott-Wave-Principle-Key-Market/dp/1616041374")], "與 Robert Prechter 合著《Elliott Wave Principle》，是波浪理論教材化的重要人物。", (4, 3, 4, 4, 5), ["https://www.amazon.com/Elliott-Wave-Principle-Key-Market/dp/1616041374"]),
    rec(44, "Glenn Neely", "格倫・尼利", "United States", "", "艾略特波浪分析師、作家", "author", [("elliott-wave", "規則化作者"), ("systems-trading", "波浪規則")], [work("Mastering Elliott Wave", 1990, url="https://www.amazon.com/Mastering-Elliott-Wave-Glenn-Neely/dp/0930233441")], "嘗試把艾略特波浪規則化與更嚴格分類，適合記錄於波浪理論研究分支。", (4, 3, 4, 4, 5), ["https://www.amazon.com/Mastering-Elliott-Wave-Glenn-Neely/dp/0930233441"]),
    rec(45, "Edson Gould", "艾德森・古爾德", "United States", "1902-1987", "市場技術分析師", "foundation", [("sentiment", "情緒/心理指標"), ("breadth", "市場指標"), ("trend-following", "長期市場判斷")], [work("Findings & Forecasts", None, "newsletter")], "Investopedia 將其列為技術分析先驅之一，以 Senti-Meter 等長期市場指標聞名。", (3, 3, 4, 4, 5), ["https://www.investopedia.com/articles/financial-theory/10/pioneers-technical-analysis.asp"]),
    rec(46, "Paul Desmond", "保羅・德斯蒙德", "United States", "", "市場技術研究者", "researcher", [("breadth", "熊市底部研究"), ("sentiment", "市場底部"), ("dow-theory", "Dow Award 得主")], [work("Identifying Bear Market Bottoms and New Bull Markets", 2002, "paper")], "2002 Charles H. Dow Award 得主，研究熊市底部與新牛市確認，適合市場寬度/底部研究資料庫。", (3, 5, 4, 3, 5), ["https://cmtassociation.org/association/award-recognizing/charles-h-dow-award/"]),
    rec(47, "Richard Russell", "理查・羅素", "United States", "1924-2015", "Dow Theory Letters 作者", "practitioner", [("dow-theory", "長期推廣者"), ("trend-following", "市場趨勢")], [work("Dow Theory Letters", 1958, "newsletter")], "長期撰寫 Dow Theory Letters，是道氏理論在現代市場評論中的代表人物。", (4, 2, 5, 3, 5), ["https://en.wikipedia.org/wiki/Richard_Russell_(Dow_Theory)"]),
    rec(48, "Stan Weinstein", "史坦・溫斯坦", "United States", "", "股票技術分析作家", "author", [("stage-analysis", "創始/推廣者"), ("relative-strength", "強勢股"), ("volume-analysis", "突破量能")], [work("Secrets for Profiting in Bull and Bear Markets", 1988)], "四階段分析與相對強弱/成交量突破選股方法在股票技術分析中常被使用。", (4, 3, 5, 4, 5), ["https://www.investopedia.com/articles/investing/070715/trading-stage-analysis.asp", "https://www.stageanalysis.net/"]),
    rec(49, "William J. O'Neil", "威廉・歐尼爾", "United States", "1933-2023", "Investor's Business Daily 創辦人、作家", "author_practitioner", [("can-slim", "創始者"), ("cup-with-handle", "推廣/定義者"), ("relative-strength", "成長股選股")], [work("How to Make Money in Stocks", 1988)], "CAN SLIM、杯柄形態與相對強弱選股方法在成長股股票交易者中極具影響力。", (5, 4, 5, 5, 5), ["https://www.investopedia.com/terms/c/canslim.asp", "https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/cup-with-handle"]),
    rec(50, "Mark Minervini", "馬克・米勒維尼", "United States", "", "股票交易者、作家", "practitioner_author", [("vcp", "創始/推廣者"), ("relative-strength", "SEPA 強勢股"), ("cup-with-handle", "成長股型態")], [work("Trade Like a Stock Market Wizard", 2013), work("Think and Trade Like a Champion", 2017)], "以 SEPA 與 VCP 波動收縮形態聞名，是現代美股動能/成長股技術交易代表。", (5, 3, 5, 5, 5), ["https://trendspider.com/learning-center/volatility-contraction-pattern-vcp/"]),
    rec(51, "Nicolas Darvas", "尼古拉斯・達瓦斯", "Hungary / United States", "1920-1977", "交易者、作家", "practitioner_author", [("chart-patterns", "箱型理論"), ("trend-following", "突破交易"), ("relative-strength", "強勢股")], [work("How I Made $2,000,000 in the Stock Market", 1960)], "Darvas Box 是早期股票箱型突破交易的經典案例。", (4, 2, 5, 4, 5), ["https://en.wikipedia.org/wiki/Nicolas_Darvas"]),
    rec(52, "Brian Shannon", "布萊恩・香農", "United States", "1967-", "CMT、交易者、作家", "author_practitioner", [("vwap", "Anchored VWAP 推廣者"), ("price-action", "多週期分析"), ("support-resistance", "市場結構")], [work("Technical Analysis Using Multiple Timeframes", 2008), work("Maximum Trading Gains with Anchored VWAP", 2023, url="https://books.google.com/books/about/Maximum_Trading_Gains_With_Anchored_VWAP.html?id=p3aCzwEACAAJ")], "多週期技術分析與 Anchored VWAP 教學影響力高，適合放入 VWAP/價格結構分類。", (5, 2, 4, 4, 5), ["https://books.google.com/books/about/Maximum_Trading_Gains_With_Anchored_VWAP.html?id=p3aCzwEACAAJ"]),
    rec(53, "Linda Bradford Raschke", "琳達・布拉德福德・拉什克", "United States", "1959-", "交易者、作家", "practitioner_author", [("price-action", "短線交易"), ("opening-range-breakout", "短線策略"), ("systems-trading", "高勝率策略")], [work("Street Smarts", 1996, url="https://www.amazon.com/Street-Smarts-Probability-Short-Term-Strategies/dp/0965046109")], "《Street Smarts》共同作者與 Market Wizards 受訪者，代表短線價格行為與實戰交易。", (4, 3, 5, 4, 5), ["https://www.amazon.com/Street-Smarts-Probability-Short-Term-Strategies/dp/0965046109", "https://lindaraschke.net/recommended-reading/"]),
    rec(54, "Laurence A. Connors", "拉倫斯・康納斯", "United States", "", "短線策略研究者、作家", "indicator_creator", [("connors-rsi", "創始者"), ("rsi", "短線改良"), ("systems-trading", "短線均值回歸")], [work("Street Smarts", 1996), work("Short Term Trading Strategies That Work", 2008), work("ConnorsRSI", 2012, "indicator")], "ConnorsRSI 與短線 RSI2/均值回歸策略在量化與短線交易圈常被引用。", (5, 3, 4, 5, 5), ["https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/connorsrsi", "https://www.amazon.com/Street-Smarts-Probability-Short-Term-Strategies/dp/0965046109"]),
    rec(55, "Andrew Cardwell", "安德魯・卡德威爾", "United States", "", "RSI 專家、交易教育者", "indicator_specialist", [("rsi", "進階詮釋者"), ("momentum", "正/負反轉與區間規則")], [work("Cardwell RSI Positive/Negative Reversals", None, "method")], "以 RSI Range Rules 與 Positive/Negative Reversals 聞名，是 RSI 進階應用的重要專家。", (2, 2, 3, 4, 5), ["https://www.linkedin.com/in/andrew-cardwell-b318099", "https://www.investopedia.com/articles/active-trading/042114/overbought-or-oversold-use-relative-strength-index-find-out.asp"]),
    rec(56, "Constance Brown", "康斯坦絲・布朗", "United States", "", "CMT、技術分析作家", "indicator_specialist", [("rsi", "進階詮釋者"), ("momentum", "Composite Index"), ("evidence-based-ta", "指標組合")], [work("Technical Analysis for the Trading Professional", 1999, url="https://www.amazon.com/Technical-Analysis-Trading-Professional-Second/dp/007175914X")], "以 RSI 區間、Composite Index 與進階動量分析聞名，常被引用於 RSI 專題研究。", (4, 3, 4, 4, 5), ["https://www.amazon.com/Technical-Analysis-Trading-Professional-Second/dp/007175914X", "https://www.barchart.com/education/technical-indicators/cmb-composite-index"]),
    rec(57, "John F. Ehlers", "約翰・艾勒斯", "United States", "", "工程師、數位訊號處理指標作者", "indicator_creator", [("cycle-analysis", "DSP 週期分析"), ("ehlers-filters", "濾波器"), ("systems-trading", "自適應指標")], [work("Rocket Science for Traders", 2001), work("Cybernetic Analysis for Stocks and Futures", 2004)], "把數位訊號處理與週期濾波引入技術指標，是現代自適應與濾波指標的重要人物。", (5, 5, 4, 5, 5), ["https://www.mesasoftware.com/TechnicalArticles.htm"]),
    rec(58, "Murray A. Ruggiero Jr.", "穆雷・魯傑羅", "United States", "", "交易系統開發者、作家", "system_developer", [("systems-trading", "交易系統"), ("backtesting", "策略測試"), ("evidence-based-ta", "量化規則")], [work("Cybernetic Trading Strategies", 1997)], "專注交易系統、模糊邏輯、機器學習與技術規則，適合交易系統與回測分類。", (4, 4, 3, 3, 4), ["https://guides.newman.baruch.cuny.edu/c.php?g=188442&p=1243542"]),
    rec(59, "Robert Pardo", "羅伯特・帕多", "United States", "", "交易系統測試作者", "system_developer", [("backtesting", "系統測試"), ("systems-trading", "交易系統"), ("evidence-based-ta", "樣本外驗證")], [work("Design, Testing, and Optimization of Trading Systems", 1992)], "其交易系統設計、測試與優化著作是量化技術分析與策略驗證常見參考。", (4, 4, 3, 3, 4), ["https://guides.newman.baruch.cuny.edu/c.php?g=188442&p=1243542"]),
    rec(60, "Howard Bandy", "霍華德・班迪", "United States", "", "量化交易系統作者", "system_developer", [("systems-trading", "交易系統"), ("backtesting", "策略驗證"), ("evidence-based-ta", "統計分析")], [work("Quantitative Trading Systems", 2007), work("Modeling Trading System Performance", 2011)], "以交易系統建模、風險與回測流程著作聞名，適合本地資料庫後續加入策略驗證欄位。", (4, 4, 3, 3, 4), ["https://guides.newman.baruch.cuny.edu/c.php?g=188442&p=1243542"]),
    rec(61, "Thomas Stridsman", "湯瑪斯・史翠茲曼", "Sweden / United States", "", "系統交易作者", "system_developer", [("systems-trading", "交易系統"), ("backtesting", "策略測試"), ("trend-following", "系統化趨勢")], [work("Trading Systems That Work", 2000)], "交易系統設計與測試作者，對規則化技術分析與系統交易資料庫有參考價值。", (4, 3, 3, 3, 4), ["https://guides.newman.baruch.cuny.edu/c.php?g=188442&p=1243542"]),
    rec(62, "Daryl Guppy", "達利・古比", "Australia", "", "交易者、作家、指標創作者", "indicator_creator", [("guppy-mma", "創始者"), ("moving-average", "多均線趨勢"), ("trend-following", "趨勢判讀")], [work("Trading Tactics", 1997)], "Guppy Multiple Moving Average 以兩組 EMA 判讀短長期交易者行為，常見於趨勢篩選。", (4, 3, 4, 5, 5), ["https://www.investopedia.com/terms/g/guppy-multiple-moving-average.asp"]),
    rec(63, "Alan Hull", "艾倫・霍爾", "Australia", "", "指標創作者、交易教育者", "indicator_creator", [("hull-ma", "創始者"), ("moving-average", "低滯後均線")], [work("Hull Moving Average", 2005, "indicator")], "Hull Moving Average 以降低均線滯後聞名，是均線類指標的重要改良。", (3, 2, 4, 5, 5), ["https://alanhull.com/the-hull-moving-average/", "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/hull-moving-average-hma"]),
    rec(64, "John R. McGinley", "約翰・麥金利", "United States", "", "CMT、指標創作者", "indicator_creator", [("mcginley-dynamic", "創始者"), ("moving-average", "自適應平滑")], [work("McGinley Dynamic", 1997, "indicator")], "McGinley Dynamic 嘗試解決傳統均線跟不上市場速度的問題，屬均線改良指標。", (3, 3, 3, 5, 5), ["https://www.earn2trade.com/blog/mcginley-dynamic-indicator/"]),
    rec(65, "Patrick G. Mulloy", "派翠克・馬洛伊", "United States", "", "指標創作者", "indicator_creator", [("tema-dema", "創始者"), ("moving-average", "低滯後均線")], [work("Smoothing Data with Faster Moving Averages", 1994, "article")], "DEMA/TEMA 改良均線滯後問題，在交易平台中常見。", (3, 3, 3, 5, 5), ["https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/triple-exponential-moving-average-tema", "https://www.investopedia.com/ask/answers/041315/why-triple-exponential-moving-average-tema-important-traders-and-analysts.asp"]),
    rec(66, "Jack K. Hutson", "傑克・哈特森", "United States", "", "Technical Analysis of Stocks & Commodities 編輯、指標創作者", "indicator_creator", [("trix", "創始者"), ("momentum", "三重平滑動量")], [work("Good TRIX", 1980, "article")], "TRIX 創作者，將三重 EMA 平滑後的變化率用於趨勢/動量訊號。", (3, 3, 3, 5, 5), ["https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/trix"]),
    rec(67, "Gene Quong", "金・匡", "United States", "", "指標共同創作者", "indicator_creator", [("mfi", "共同創始者"), ("volume-analysis", "量價動量")], [work("Money Flow Index", 1989, "indicator")], "Money Flow Index 共同創作者，將成交量整合進 RSI 類動量分析。", (2, 2, 3, 5, 5), ["https://www.tradingview.com/support/solutions/43000502348-money-flow-mfi/"]),
    rec(68, "Avrum Soudack", "阿夫魯姆・蘇達克", "United States", "", "指標共同創作者", "indicator_creator", [("mfi", "共同創始者"), ("volume-analysis", "量價動量")], [work("Money Flow Index", 1989, "indicator")], "Money Flow Index 共同創作者，MFI 也常被稱為加入成交量的 RSI。", (2, 2, 3, 5, 5), ["https://www.tradingview.com/support/solutions/43000502348-money-flow-mfi/"]),
    rec(69, "Peter G. Martin", "彼得・馬丁", "United States", "", "風險指標創作者", "indicator_creator", [("ulcer-index", "共同創始者"), ("risk", "下行風險")], [work("The Investor's Guide to Fidelity Funds", 1989)], "Ulcer Index 共同創作者，用於衡量下行風險與回撤痛苦程度。", (3, 3, 3, 5, 4), ["https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/ulcer-index"]),
    rec(70, "Byron McCann", "拜倫・麥肯", "United States", "", "風險指標共同創作者", "indicator_creator", [("ulcer-index", "共同創始者"), ("risk", "下行風險")], [work("The Investor's Guide to Fidelity Funds", 1989)], "Ulcer Index 共同作者，適合放入技術分析風險/回撤指標分類。", (3, 3, 3, 5, 4), ["https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/ulcer-index"]),
    rec(71, "Etienne Botes", "艾蒂安・博特斯", "South Africa", "", "指標共同創作者", "indicator_creator", [("vortex-indicator", "共同創始者"), ("trend-following", "趨勢反轉")], [work("The Vortex Indicator", 2010, "article")], "Vortex Indicator 共同創作者，該指標受 Wilder DMI 啟發，用於趨勢轉折與確認。", (3, 4, 3, 5, 5), ["https://traders.com/documentation/feedbk_docs/2010/01/Botes.html", "https://www.investopedia.com/terms/v/vortex-indicator-vi.asp"]),
    rec(72, "Douglas Siepman", "道格拉斯・西普曼", "South Africa", "", "指標共同創作者", "indicator_creator", [("vortex-indicator", "共同創始者"), ("trend-following", "趨勢反轉")], [work("The Vortex Indicator", 2010, "article")], "Vortex Indicator 共同創作者，適合歸檔於 DMI 類趨勢與方向變化指標。", (3, 4, 3, 5, 5), ["https://traders.com/documentation/feedbk_docs/2010/01/Botes.html", "https://www.investopedia.com/terms/v/vortex-indicator-vi.asp"]),
    rec(73, "Olivier Seban", "奧利維耶・塞班", "France", "", "交易者、指標創作者", "indicator_creator", [("supertrend", "創始者"), ("atr", "ATR 通道應用"), ("trend-following", "趨勢跟隨")], [work("SuperTrend", 2009, "indicator")], "SuperTrend 創作者，該指標以 ATR 與倍數形成趨勢方向線，在交易平台中非常常見。", (3, 2, 4, 5, 5), ["https://www.tradingview.com/support/solutions/43000634738-supertrend/", "https://www.investopedia.com/supertrend-indicator-7976167"]),
    rec(74, "Hank Pruden", "漢克・普魯登", "United States", "1936-2018", "學者、Wyckoff 教育者、CMT 社群人物", "educator", [("wyckoff-method", "教育者"), ("volume-analysis", "供需/量價"), ("systems-trading", "三大交易技能")], [work("The Three Skills of Top Trading", 2007)], "將 Wyckoff 方法帶入學術與 CMT 教育脈絡，適合威科夫方法專家分類。", (4, 4, 4, 4, 5), ["https://www.wyckoffanalytics.com/hank-pruden/", "https://chartschool.stockcharts.com/table-of-contents/market-analysis/wyckoff-analysis-articles/the-wyckoff-method-a-tutorial"]),
    rec(75, "David Weis", "大衛・韋斯", "United States", "1942-2020", "Wyckoff 交易者、作家", "educator", [("wyckoff-method", "現代改編者"), ("volume-analysis", "Weis Wave"), ("price-action", "價格量能")], [work("Trades About to Happen", 2013, url="https://books.google.com/books/about/Trades_About_to_Happen.html?id=IPw1CgAAQBAJ")], "把 Wyckoff 原理改編為現代量價與 Weis Wave 工具，是威科夫實戰資料的重要人物。", (4, 3, 4, 4, 5), ["https://www.wyckoffanalytics.com/david-weis/", "https://books.google.com/books/about/Trades_About_to_Happen.html?id=IPw1CgAAQBAJ"]),
    rec(76, "Tom Williams", "湯姆・威廉斯", "United Kingdom", "1929-2016", "VSA 創始/推廣者、TradeGuider 創辦人", "indicator_specialist", [("volume-spread-analysis", "創始/推廣者"), ("wyckoff-method", "威科夫衍生"), ("volume-analysis", "量價差")], [work("Master the Markets", 1993)], "Volume Spread Analysis 代表人物，將 Wyckoff 供需觀念整理為 VSA 量價差分析。", (3, 2, 4, 4, 5), ["https://www.acmetrades.com/tom-williams", "https://www.tradeguider.com/resource_center1.asp"]),
    rec(77, "A. W. Cohen", "A・W・科恩", "United States", "", "點數圖作者、Chartcraft 創辦人", "charting_specialist", [("point-and-figure", "3-box reversal 推廣者"), ("breadth", "Bullish Percent")], [work("How to Use the Three-Point Reversal Method of Point & Figure Stock Market Trading", 1947)], "被 StockCharts 介紹為經典 3-box reversal P&F 圖的代表人物之一。", (4, 2, 4, 4, 5), ["https://chartschool.stockcharts.com/table-of-contents/chart-analysis/point-and-figure-charts/point-and-figure-basics/introduction-to-point-and-figure-charts"]),
    rec(78, "Thomas J. Dorsey", "湯瑪斯・多爾西", "United States", "", "點數圖作家、Dorsey Wright 創辦人", "charting_specialist", [("point-and-figure", "現代推廣者"), ("relative-strength", "P&F 相對強弱")], [work("Point & Figure Charting", 1995)], "現代 Point & Figure 教育與相對強弱分析代表人物，Nasdaq Dorsey Wright 方法與其相關。", (4, 3, 4, 4, 5), ["https://www.investopedia.com/terms/p/pointandfigurechart.asp", "https://oxlive.dorseywright.com/university/faq.html"]),
    rec(79, "Jeremy du Plessis", "傑瑞米・杜普萊西斯", "South Africa / United Kingdom", "", "點數圖作家", "charting_specialist", [("point-and-figure", "現代教材作者"), ("bollinger-bands", "P&F 結合指標"), ("rsi", "P&F 結合指標")], [work("The Definitive Guide to Point and Figure", 2005), work("21st Century Point and Figure", 2015, url="https://harriman-house.com/authors/jeremy-du-plessis/21st-century-point-and-figure/9780857194428")], "點數圖現代教材代表作者，尤其適合 P&F 與其他技術指標整合分類。", (4, 3, 4, 4, 5), ["https://harriman-house.com/authors/jeremy-du-plessis/21st-century-point-and-figure/9780857194428"]),
    rec(80, "J. Peter Steidlmayer", "彼得・史戴梅爾", "United States", "", "CBOT 交易員、Market Profile 創始者", "indicator_creator", [("market-profile", "創始者"), ("volume-analysis", "價格時間分佈"), ("support-resistance", "價值區")], [work("Markets and Market Logic", 1986), work("Steidlmayer on Markets", 1989)], "Market Profile 創始者，把拍賣市場、時間價格機會與價值區概念帶入交易分析。", (4, 3, 5, 5, 5), ["https://www.profiletrading.com/about/"]),
    rec(81, "James F. Dalton", "詹姆斯・道爾頓", "United States", "", "Market Profile 作家、教育者", "author_practitioner", [("market-profile", "推廣者/作者"), ("price-action", "拍賣市場邏輯")], [work("Mind Over Markets", 1990), work("Markets in Profile", 2007, url="https://jimdaltontrading.com/books/")], "Market Profile 主要教材作者之一，讓拍賣市場與市場結構方法更容易被交易者使用。", (4, 3, 4, 4, 5), ["https://jimdaltontrading.com/books/"]),
    rec(82, "Mark B. Fisher", "馬克・費雪", "United States", "", "交易所交易者、ACD 方法作者", "practitioner_author", [("acd-method", "創始者"), ("opening-range-breakout", "開盤區間"), ("support-resistance", "Pivot range")], [work("The Logical Trader", 2002)], "ACD 方法以開盤區間、A/C 點與 Pivot Range 判斷趨勢強弱，常見於短線/商品交易。", (4, 3, 4, 5, 5), ["https://www.investopedia.com/articles/technical/04/032404.asp", "https://www.investopedia.com/articles/technical/04/040704.asp"]),
    rec(83, "Toby Crabel", "托比・克拉貝爾", "United States", "", "交易者、開盤區間突破作者", "practitioner_author", [("opening-range-breakout", "代表作者"), ("price-action", "Narrow Range 型態"), ("volatility", "波動擴張")], [work("Day Trading with Short Term Price Patterns and Opening Range Breakout", 1990)], "短線價格型態、Narrow Range 與 Opening Range Breakout 的重要作者。", (4, 3, 4, 4, 5), ["https://oxfordstrat.com/trading-strategies/toby-crabel-narrow-range-1/"]),
    rec(84, "Victor Sperandeo", "維克多・斯佩蘭迪奧", "United States", "1945-", "交易者、作家", "practitioner_author", [("price-action", "2B 型態"), ("trend-following", "1-2-3 反轉"), ("support-resistance", "趨勢線")], [work("Trader Vic: Methods of a Wall Street Master", 1991)], "Trader Vic 2B 與 1-2-3 反轉方法常被技術交易者引用，用於趨勢失敗與反轉判斷。", (4, 2, 4, 4, 5), ["https://thepatternsite.com/2B.html"]),
    rec(85, "Robert C. Miner", "羅伯特・邁納", "United States", "", "技術分析軟體/教育者、作家", "author_practitioner", [("elliott-wave", "波浪/時間價格"), ("fibonacci", "時間價格"), ("momentum", "多週期動量")], [work("Dynamic Trading", 1997, url="https://dynamictraders.com/dt-books/")], "Dynamic Trading 結合時間、價格、型態與動量，常被波浪與 Fibonacci 交易者引用。", (4, 3, 4, 4, 5), ["https://dynamictraders.com/dt-books/"]),
    rec(86, "Carolyn Boroden", "卡洛琳・波羅登", "United States", "", "Fibonacci 技術分析師、作家", "indicator_specialist", [("fibonacci", "時間價格專家"), ("support-resistance", "價格叢集"), ("elliott-wave", "波浪/時間")], [work("Fibonacci Trading", 2008)], "以 Fibonacci 時間與價格分析聞名，適合專屬歸檔於 Fibonacci 分析專家。", (3, 2, 4, 4, 5), ["https://www.moneyshow.com/expert/ote17731/carolyn-boroden/", "https://www.elliottwavetrader.net/analyst/Carolyn-Boroden"]),
    rec(87, "Joe DiNapoli", "喬・迪納波利", "United States", "", "Fibonacci 交易方法作者", "indicator_specialist", [("fibonacci", "DiNapoli Levels"), ("support-resistance", "價格叢集")], [work("DiNapoli Levels", 1998)], "DiNapoli Levels 是 Fibonacci 回撤/擴展的實戰化方法，常用於關鍵支撐阻力。", (4, 2, 4, 4, 5), ["https://www.mql5.com/en/articles/3061"]),
    rec(88, "Alan Andrews", "艾倫・安德魯斯", "United States", "", "Median Line / Pitchfork 方法創作者", "indicator_creator", [("andrew-pitchfork", "創始者"), ("support-resistance", "中線/通道"), ("price-action", "擺動點")], [work("Andrews' Pitchfork", None, "drawing_tool")], "Andrews' Pitchfork 以三點繪製中線與平行通道，是支撐阻力和趨勢通道工具。", (3, 2, 4, 5, 5), ["https://www.investopedia.com/articles/forex/05/andrewspitchfork.asp", "https://www.optuma.com/blog/pitchforks-part-1"]),
    rec(89, "Arthur A. Merrill", "亞瑟・梅里爾", "United States", "1906-2006", "技術分析作家、統計研究者", "author_researcher", [("chart-patterns", "M/W 型態"), ("cycle-analysis", "Filtered Waves"), ("backtesting", "型態統計")], [work("Filtered Waves: Basic Theory", 1977), work("Behavior of Prices on Wall Street", 1966)], "以 M/W 型態與 Filtered Waves 著作聞名，是早期量化型圖表研究人物。", (4, 3, 3, 3, 5), ["https://www.amazon.com/Filtered-Waves-Basic-Theory-Analysis/dp/0911894365"]),
    rec(90, "Humphrey B. Neill", "漢弗萊・尼爾", "United States", "1895-1977", "市場心理/讀帶作家", "author", [("tape-reading", "經典作者"), ("sentiment", "逆向思考"), ("price-action", "市場心理")], [work("Tape Reading and Market Tactics", 1931, url="https://books.google.com/books/about/Tape_Reading_and_Market_Tactics.html?id=XuiREQAAQBAJ"), work("The Art of Contrary Thinking", 1954)], "讀帶與逆向思考經典作者，適合情緒、盤口與早期技術分析文獻分類。", (4, 2, 4, 3, 5), ["https://books.google.com/books/about/Tape_Reading_and_Market_Tactics.html?id=XuiREQAAQBAJ"]),
    rec(91, "Walter Deemer", "華特・迪默", "United States", "", "技術分析師、作家", "practitioner_author", [("trend-following", "市場時機"), ("breadth", "市場備忘錄"), ("sentiment", "市場心理")], [work("Deemer on Technical Analysis", 2012), work("Market Memos", 1966, "archive")], "長期市場技術分析師，著作與 Market Memos 檔案適合作為近代市場評論文獻。", (4, 3, 4, 3, 5), ["https://www.walterdeemer.com/", "https://deemermarketmemos.com/"]),
    rec(92, "Ned Davis", "內德・戴維斯", "United States", "", "量化市場研究機構創辦人", "researcher", [("breadth", "市場指標"), ("sentiment", "情緒模型"), ("evidence-based-ta", "量化市場研究")], [work("Being Right or Making Money", 1991), work("The Research Driven Investor", 2000)], "Ned Davis Research 長期以廣度、情緒、總體與技術模型做市場研究，適合指標集合與量化研究分類。", (4, 4, 4, 3, 5), ["https://info.ndr.com/ndr-signals/which-indicators-should-i-follow"]),
    rec(93, "Jason Goepfert", "傑森・戈普弗特", "United States", "", "SentimenTrader 創辦人、Dow Award 得主", "researcher", [("sentiment", "情緒指標"), ("breadth", "基金現金/市場指標"), ("evidence-based-ta", "歷史統計")], [work("Mutual Fund Cash Reserves, The Risk-Free Rate, and Stock Market Performance", 2004, "paper")], "2004 Charles H. Dow Award 得主，長期研究投資人情緒與市場統計。", (3, 5, 4, 3, 5), ["https://cmtassociation.org/association/award-recognizing/charles-h-dow-award/"]),
    rec(94, "Buff Dormeier", "巴夫・多米爾", "United States", "", "CMT、量價研究者、Dow Award 得主", "researcher_author", [("volume-analysis", "量價研究"), ("breadth", "成交量廣度"), ("evidence-based-ta", "Dow Award 研究")], [work("Price and Volume: Digging Deeper", 2007, "paper"), work("Investing with Volume Analysis", 2011)], "2007 Charles H. Dow Award 得主，量價與成交量分析著作具資料庫價值。", (4, 5, 4, 4, 5), ["https://cmtassociation.org/association/award-recognizing/charles-h-dow-award/"]),
    rec(95, "Andrew Thrasher", "安德魯・思拉舍", "United States", "", "CMT、投資組合經理、Dow Award 得主", "researcher", [("volatility", "波動/風險"), ("sentiment", "市場警訊"), ("breadth", "市場健康")], [work("Forecasting a Volatility Tsunami", 2017, "paper"), work("The 5% Canary", 2023, "paper")], "兩度 Charles H. Dow Award 相關得主/研究者，波動率與市場風險研究值得收錄。", (3, 5, 4, 3, 5), ["https://cmtassociation.org/association/award-recognizing/charles-h-dow-award/"]),
    rec(96, "Alex Spiroglou", "亞歷克斯・斯皮羅格魯", "Greece / United Kingdom", "", "CMT、CFTe、Dow Award 得主", "researcher", [("macd", "MACD-V"), ("volatility", "波動標準化動量"), ("momentum", "動量研究")], [work("MACD-V: Volatility Normalised Momentum", 2022, "paper")], "2022 Charles H. Dow Award 得主，將 MACD 轉為波動標準化動量框架。", (3, 5, 4, 4, 5), ["https://cmtassociation.org/association/award-recognizing/charles-h-dow-award/"]),
    rec(97, "Ralph Vince", "拉爾夫・文斯", "United States", "", "風險/資金管理作者、Dow Award 得主", "researcher_author", [("breadth", "新低數研究"), ("systems-trading", "資金管理"), ("evidence-based-ta", "統計研究")], [work("The Mathematics of Money Management", 1992), work("The Ripple Effect of Daily New Lows", 2024, "paper")], "資金管理與風險數學作者，2024 Dow Award 研究把每日新低數作為市場廣度訊號。", (5, 5, 4, 3, 5), ["https://cmtassociation.org/association/award-recognizing/charles-h-dow-award/"]),
    rec(98, "Gary Antonacci", "蓋瑞・安東納奇", "United States", "", "動量投資作者、Dow Award 得主", "researcher_author", [("momentum", "雙動量"), ("trend-following", "產業趨勢"), ("relative-strength", "相對/絕對動量")], [work("Dual Momentum Investing", 2014), work("A Century of Profitable Industry Trends", 2025, "paper")], "動量投資作者，2025 Charles H. Dow Award 共同得主，適合動量與產業趨勢研究分類。", (4, 5, 4, 3, 5), ["https://cmtassociation.org/association/award-recognizing/charles-h-dow-award/"]),
    rec(99, "Andrew W. Lo", "安德魯・羅", "United States", "1960-", "MIT 金融學者", "academic", [("evidence-based-ta", "學術研究"), ("chart-patterns", "計算型型態識別"), ("backtesting", "統計推論")], [work("Foundations of Technical Analysis", 2000, "paper", url="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=228099"), work("The Evolution of Technical Analysis", 2010)], "將技術分析型態以計算演算法與統計推論研究，是學術文獻中的代表人物。", (5, 5, 5, 3, 4), ["https://papers.ssrn.com/sol3/papers.cfm?abstract_id=228099", "https://ideas.repec.org/p/nbr/nberwo/7613.html"]),
    rec(100, "David Aronson", "大衛・阿隆森", "United States", "", "實證技術分析作者、系統研究者", "academic_practitioner", [("evidence-based-ta", "代表作者"), ("backtesting", "資料探勘校正"), ("systems-trading", "客觀規則")], [work("Evidence-Based Technical Analysis", 2006, url="https://www.wiley.com/en-ca/Evidence-Based%2BTechnical%2BAnalysis%3A%2BApplying%2Bthe%2BScientific%2BMethod%2Band%2BStatistical%2BInference%2Bto%2BTrading%2BSignals-p-9780470008744")], "主張用科學方法與統計檢定評估技術交易訊號，是建立資料庫時避免迷信指標的重要參考。", (5, 5, 4, 3, 4), ["https://www.wiley.com/en-ca/Evidence-Based%2BTechnical%2BAnalysis%3A%2BApplying%2Bthe%2BScientific%2BMethod%2Band%2BStatistical%2BInference%2Bto%2BTrading%2BSignals-p-9780470008744", "https://www.amazon.com/Evidence-Based-Technical-Analysis-Scientific-Statistical/dp/0470008741"]),
]


SOURCE_CATALOG.update(
    {
        "https://archive.org/details/stockmarketbarom00hami": ("Internet Archive - The Stock Market Barometer", "book_archive"),
        "https://openlibrary.org/books/OL7031671M/The_stock_market_barometer": ("Open Library - The Stock Market Barometer", "book_catalog"),
        "https://openlibrary.org/books/OL17060688M/The_encyclopedia_of_technical_market_indicators": ("Open Library - The Encyclopedia of Technical Market Indicators", "book_catalog"),
        "https://books.google.com/books/about/The_Encyclopedia_Of_Technical_Market_Ind.html?id=f82LUFQVGOUC": ("Google Books - The Encyclopedia of Technical Market Indicators", "book_catalog"),
        "https://openlibrary.org/works/OL3510350W/New_key_to_stock_market_profits": ("Open Library - New Key to Stock Market Profits", "book_catalog"),
        "https://books.google.com/books/about/New_Key_to_Stock_Market_Profits.html?id=Z8xl5AAACAAJ": ("Google Books - New Key to Stock Market Profits", "book_catalog"),
        "https://www.investopedia.com/articles/active-trading/031814/using-coppock-curve-generate-stock-trade-signals.asp": ("Investopedia - Coppock Curve Trade Signals", "indicator_reference"),
        "https://www.incrediblecharts.com/indicators/coppock_indicator.php": ("Incredible Charts - Coppock Indicator", "indicator_reference"),
        "https://openlibrary.org/books/OL1864784M/Japanese_candlestick_charting_techniques": ("Open Library - Japanese Candlestick Charting Techniques", "book_catalog"),
        "https://www.amazon.com/Japanese-Candlestick-Charting-Techniques-Second/dp/0735201811": ("Amazon - Japanese Candlestick Charting Techniques", "book_catalog"),
        "https://www.hotcandlestick.com/candlesticks.htm": ("HotCandlestick - History of Candlestick Charting", "history"),
        "https://ftmo.com/en/blog/technical-analysis-history-of-candlestick-charts/": ("FTMO - History of Candlestick Charts", "history"),
        "https://www.elliottwave.com/books/elliott-wave-principle/": ("Elliott Wave International - Elliott Wave Principle", "official"),
        "https://www.neowave.com/product-book.asp": ("NEoWave - Mastering Elliott Wave Book", "official"),
        "https://glennneely.com/": ("Glenn Neely Official Site", "official"),
        "https://chartschool.stockcharts.com/table-of-contents/chart-analysis/chart-annotation-tools/speed-resistance-lines": ("StockCharts ChartSchool - Speed Resistance Lines", "indicator_reference"),
        "https://www.mcoscillator.com/learning_center/weekly_chart/edson_goulds_daily_point_index/": ("McClellan Market Report - Edson Gould Daily Point Index", "indicator_reference"),
        "https://www.fa-mag.com/news/richard-russell--publisher-of-dow-theory-letters--dies-at-91-23996.html?print=": ("Financial Advisor - Richard Russell Obituary", "professional_profile"),
        "https://www.trendfollowing.com/2013/03/16/ep-109-richard-russell-and-dow-theory-with-michael-covel-on-trend-following-radio/": ("Trend Following - Richard Russell and Dow Theory", "interview"),
        "https://www.investopedia.com/terms/m/mcginley-dynamic.asp": ("Investopedia - McGinley Dynamic", "indicator_reference"),
        "https://dotnet.stockindicators.dev/indicators/Dynamic/": ("Stock Indicators - McGinley Dynamic", "indicator_reference"),
        "https://library.tradingtechnologies.com/trade/chrt-ti-money-flow-index.html": ("Trading Technologies - Money Flow Index", "indicator_reference"),
        "https://help.stockstrader.com/en/support/solutions/articles/33000210228-money-flow-index-mfi-": ("StocksTrader - Money Flow Index", "indicator_reference"),
        "https://books.google.com/books/about/How_to_Use_the_Three_point_Reversal_Meth.html?id=iMdEAAAAIAAJ": ("Google Books - Three-point Reversal Method", "book_catalog"),
        "https://openlibrary.org/works/OL174845W/How_to_use_the_three-point_reversal_method_of_point_figure_stock_market_trading": ("Open Library - Three-point Reversal Method", "book_catalog"),
        "https://books.google.com/books/about/Dynamic_Trading.html?id=ymtaAAAAYAAJ": ("Google Books - Dynamic Trading", "book_catalog"),
        "https://www.amazon.com/Dynamic-Trading-Practical-Strategies-Investors/dp/093438083X": ("Amazon - Dynamic Trading", "book_catalog"),
        "https://www.amazon.com/DiNapoli-Levels-Practical-Application-Investment/dp/1891159046": ("Amazon - DiNapoli Levels", "book_catalog"),
        "https://www.moneyshow.com/expert/2160spk/": ("MoneyShow - Joe DiNapoli", "professional_profile"),
        "https://books.google.com/books/about/Behavior_of_Prices_on_Wall_Street.html?id=wEsUAQAAMAAJ": ("Google Books - Behavior of Prices on Wall Street", "book_catalog"),
        "https://openlibrary.org/books/OL5991950M/Behavior_of_prices_on_Wall_Street.": ("Open Library - Behavior of Prices on Wall Street", "book_catalog"),
        "https://www.amazon.com/Being-Right-Making-Money-Davis/dp/1118992067": ("Amazon - Being Right or Making Money", "book_catalog"),
        "https://books.google.com/books/about/Being_Right_or_Making_Money.html?id=wLhYBQAAQBAJ": ("Google Books - Being Right or Making Money", "book_catalog"),
        "https://info.ndr.com/ndr-signals": ("Ned Davis Research - NDR Signals", "official"),
    }
)


SUPPLEMENTAL_EXPERT_SOURCES = {
    "William Peter Hamilton": [
        "https://archive.org/details/stockmarketbarom00hami",
        "https://openlibrary.org/books/OL7031671M/The_stock_market_barometer",
    ],
    "Robert W. Colby": [
        "https://openlibrary.org/books/OL17060688M/The_encyclopedia_of_technical_market_indicators",
        "https://books.google.com/books/about/The_Encyclopedia_Of_Technical_Market_Ind.html?id=f82LUFQVGOUC",
    ],
    "Joseph Granville": [
        "https://openlibrary.org/works/OL3510350W/New_key_to_stock_market_profits",
        "https://books.google.com/books/about/New_Key_to_Stock_Market_Profits.html?id=Z8xl5AAACAAJ",
    ],
    "Edwin S. Coppock": [
        "https://www.investopedia.com/articles/active-trading/031814/using-coppock-curve-generate-stock-trade-signals.asp",
        "https://www.incrediblecharts.com/indicators/coppock_indicator.php",
    ],
    "Steve Nison": [
        "https://openlibrary.org/books/OL1864784M/Japanese_candlestick_charting_techniques",
        "https://www.amazon.com/Japanese-Candlestick-Charting-Techniques-Second/dp/0735201811",
    ],
    "Munehisa Homma": [
        "https://www.hotcandlestick.com/candlesticks.htm",
        "https://ftmo.com/en/blog/technical-analysis-history-of-candlestick-charts/",
    ],
    "A. J. Frost": [
        "https://www.elliottwave.com/books/elliott-wave-principle/",
    ],
    "Glenn Neely": [
        "https://www.neowave.com/product-book.asp",
        "https://glennneely.com/",
    ],
    "Edson Gould": [
        "https://chartschool.stockcharts.com/table-of-contents/chart-analysis/chart-annotation-tools/speed-resistance-lines",
        "https://www.mcoscillator.com/learning_center/weekly_chart/edson_goulds_daily_point_index/",
    ],
    "Richard Russell": [
        "https://www.fa-mag.com/news/richard-russell--publisher-of-dow-theory-letters--dies-at-91-23996.html?print=",
        "https://www.trendfollowing.com/2013/03/16/ep-109-richard-russell-and-dow-theory-with-michael-covel-on-trend-following-radio/",
    ],
    "John R. McGinley": [
        "https://www.investopedia.com/terms/m/mcginley-dynamic.asp",
        "https://dotnet.stockindicators.dev/indicators/Dynamic/",
    ],
    "Gene Quong": [
        "https://library.tradingtechnologies.com/trade/chrt-ti-money-flow-index.html",
        "https://help.stockstrader.com/en/support/solutions/articles/33000210228-money-flow-index-mfi-",
    ],
    "Avrum Soudack": [
        "https://library.tradingtechnologies.com/trade/chrt-ti-money-flow-index.html",
        "https://help.stockstrader.com/en/support/solutions/articles/33000210228-money-flow-index-mfi-",
    ],
    "A. W. Cohen": [
        "https://books.google.com/books/about/How_to_Use_the_Three_point_Reversal_Meth.html?id=iMdEAAAAIAAJ",
        "https://openlibrary.org/works/OL174845W/How_to_use_the_three-point_reversal_method_of_point_figure_stock_market_trading",
    ],
    "Robert C. Miner": [
        "https://books.google.com/books/about/Dynamic_Trading.html?id=ymtaAAAAYAAJ",
        "https://www.amazon.com/Dynamic-Trading-Practical-Strategies-Investors/dp/093438083X",
    ],
    "Joe DiNapoli": [
        "https://www.amazon.com/DiNapoli-Levels-Practical-Application-Investment/dp/1891159046",
        "https://www.moneyshow.com/expert/2160spk/",
    ],
    "Arthur A. Merrill": [
        "https://books.google.com/books/about/Behavior_of_Prices_on_Wall_Street.html?id=wEsUAQAAMAAJ",
        "https://openlibrary.org/books/OL5991950M/Behavior_of_prices_on_Wall_Street.",
    ],
    "Ned Davis": [
        "https://www.amazon.com/Being-Right-Making-Money-Davis/dp/1118992067",
        "https://books.google.com/books/about/Being_Right_or_Making_Money.html?id=wLhYBQAAQBAJ",
        "https://info.ndr.com/ndr-signals",
    ],
}


for expert in EXPERTS:
    for url in SUPPLEMENTAL_EXPERT_SOURCES.get(expert["name_en"], []):
        if url not in expert["sources"]:
            expert["sources"].append(url)


def slugify(value):
    value = value.lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value


def total_score(expert):
    return sum(expert["scores"].values())


def source_record(url):
    title, source_type = SOURCE_CATALOG.get(url, (url, "uncataloged"))
    return {
        "url": url,
        "title": title,
        "source_type": source_type,
        "reliability": "high" if source_type in {"official", "academic_paper", "award_research", "book_catalog", "indicator_reference", "professional_profile"} else "medium",
        "notes": "",
    }


def validate():
    if len(EXPERTS) != 100:
        raise SystemExit(f"Expected exactly 100 experts, found {len(EXPERTS)}")

    ids = [slugify(expert["name_en"]) for expert in EXPERTS]
    duplicates = sorted({item for item in ids if ids.count(item) > 1})
    if duplicates:
        raise SystemExit(f"Duplicate expert ids: {duplicates}")

    ranks = [expert["rank"] for expert in EXPERTS]
    if sorted(ranks) != list(range(1, 101)):
        raise SystemExit("Ranks must be exactly 1..100")

    missing_sources = sorted({url for expert in EXPERTS for url in expert["sources"] if url not in SOURCE_CATALOG})
    if missing_sources:
        print("Warning: uncataloged sources:")
        for url in missing_sources:
            print(f"  - {url}")


def build_sqlite(experts):
    if DB_PATH.exists():
        DB_PATH.unlink()

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.executescript(
        """
        CREATE TABLE metadata (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );

        CREATE TABLE experts (
            id TEXT PRIMARY KEY,
            rank INTEGER UNIQUE NOT NULL,
            name_en TEXT NOT NULL,
            name_zh TEXT NOT NULL,
            country_region TEXT,
            years TEXT,
            role TEXT,
            category TEXT,
            why_selected_zh TEXT,
            books_literature_score INTEGER NOT NULL,
            papers_research_score INTEGER NOT NULL,
            public_fame_score INTEGER NOT NULL,
            indicator_specialist_score INTEGER NOT NULL,
            stock_ta_focus_score INTEGER NOT NULL,
            total_score INTEGER NOT NULL
        );

        CREATE TABLE concepts (
            slug TEXT PRIMARY KEY,
            name_zh TEXT NOT NULL,
            name_en TEXT NOT NULL,
            family TEXT NOT NULL,
            description TEXT
        );

        CREATE TABLE expert_concepts (
            expert_id TEXT NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
            concept_slug TEXT NOT NULL REFERENCES concepts(slug) ON DELETE CASCADE,
            relation TEXT NOT NULL,
            PRIMARY KEY (expert_id, concept_slug, relation)
        );

        CREATE TABLE works (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            expert_id TEXT NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            year INTEGER,
            work_type TEXT,
            url TEXT,
            notes TEXT
        );

        CREATE TABLE sources (
            url TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            source_type TEXT NOT NULL,
            reliability TEXT NOT NULL,
            notes TEXT
        );

        CREATE TABLE expert_sources (
            expert_id TEXT NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
            source_url TEXT NOT NULL REFERENCES sources(url) ON DELETE CASCADE,
            note TEXT,
            PRIMARY KEY (expert_id, source_url)
        );
        """
    )

    conn.executemany(
        "INSERT INTO metadata(key, value) VALUES (?, ?)",
        [
            ("database_name", "technical_analysis_experts"),
            ("created_on", "2026-06-21"),
            ("language", "zh-Hant / English"),
            (
                "selection_basis_zh",
                "綜合指標原創性、經典書籍/文獻、CMT/Charles H. Dow Award 研究、公開知名度、股票技術分析相關度。",
            ),
            ("status_zh", "第一版研究種子資料；後續可逐筆補 DOI、ISBN、原始論文 PDF 與更多專家。"),
        ],
    )

    for slug, (name_zh, name_en, family) in CONCEPTS.items():
        conn.execute(
            "INSERT INTO concepts(slug, name_zh, name_en, family, description) VALUES (?, ?, ?, ?, ?)",
            (slug, name_zh, name_en, family, ""),
        )

    all_source_urls = sorted({url for expert in experts for url in expert["sources"]})
    conn.executemany(
        "INSERT INTO sources(url, title, source_type, reliability, notes) VALUES (:url, :title, :source_type, :reliability, :notes)",
        [source_record(url) for url in all_source_urls],
    )

    for expert in experts:
        expert_id = slugify(expert["name_en"])
        scores = expert["scores"]
        conn.execute(
            """
            INSERT INTO experts (
                id, rank, name_en, name_zh, country_region, years, role, category, why_selected_zh,
                books_literature_score, papers_research_score, public_fame_score,
                indicator_specialist_score, stock_ta_focus_score, total_score
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                expert_id,
                expert["rank"],
                expert["name_en"],
                expert["name_zh"],
                expert["country_region"],
                expert["years"],
                expert["role"],
                expert["category"],
                expert["why_selected_zh"],
                scores["books_literature"],
                scores["papers_research"],
                scores["public_fame"],
                scores["indicator_specialist"],
                scores["stock_ta_focus"],
                total_score(expert),
            ),
        )

        for concept in expert["concepts"]:
            slug = concept["slug"]
            if slug not in CONCEPTS:
                conn.execute(
                    "INSERT OR IGNORE INTO concepts(slug, name_zh, name_en, family, description) VALUES (?, ?, ?, ?, ?)",
                    (slug, slug, slug.replace("-", " ").title(), "uncategorized", ""),
                )
            conn.execute(
                "INSERT INTO expert_concepts(expert_id, concept_slug, relation) VALUES (?, ?, ?)",
                (expert_id, slug, concept["relation"]),
            )

        for item in expert["works"]:
            conn.execute(
                "INSERT INTO works(expert_id, title, year, work_type, url, notes) VALUES (?, ?, ?, ?, ?, ?)",
                (
                    expert_id,
                    item["title"],
                    item["year"],
                    item["type"],
                    item["url"],
                    item["notes"],
                ),
            )

        for url in expert["sources"]:
            conn.execute(
                "INSERT INTO expert_sources(expert_id, source_url, note) VALUES (?, ?, ?)",
                (expert_id, url, ""),
            )

    conn.commit()
    conn.close()


def write_seed_json(experts):
    export = {
        "metadata": {
            "created_on": "2026-06-21",
            "selection_basis_zh": "綜合指標原創性、經典書籍/文獻、CMT/Charles H. Dow Award 研究、公開知名度、股票技術分析相關度。",
            "record_count": len(experts),
        },
        "concepts": CONCEPTS,
        "experts": experts,
    }
    SEED_JSON_PATH.write_text(json.dumps(export, ensure_ascii=False, indent=2), encoding="utf-8")


def write_csvs(experts):
    with EXPERT_CSV_PATH.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "rank",
                "name_zh",
                "name_en",
                "country_region",
                "years",
                "role",
                "category",
                "main_concepts_zh",
                "notable_works",
                "total_score",
                "why_selected_zh",
                "sources",
            ],
        )
        writer.writeheader()
        for expert in experts:
            concept_names = []
            for concept in expert["concepts"]:
                info = CONCEPTS.get(concept["slug"], (concept["slug"], concept["slug"], ""))
                concept_names.append(f"{info[0]}({concept['relation']})")
            writer.writerow(
                {
                    "rank": expert["rank"],
                    "name_zh": expert["name_zh"],
                    "name_en": expert["name_en"],
                    "country_region": expert["country_region"],
                    "years": expert["years"],
                    "role": expert["role"],
                    "category": expert["category"],
                    "main_concepts_zh": "；".join(concept_names),
                    "notable_works": "；".join(item["title"] for item in expert["works"]),
                    "total_score": total_score(expert),
                    "why_selected_zh": expert["why_selected_zh"],
                    "sources": "；".join(expert["sources"]),
                }
            )

    with CONCEPT_CSV_PATH.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["concept_slug", "concept_zh", "concept_en", "family", "expert_rank", "expert_zh", "expert_en", "relation"])
        writer.writeheader()
        for expert in experts:
            for concept in expert["concepts"]:
                info = CONCEPTS.get(concept["slug"], (concept["slug"], concept["slug"], "uncategorized"))
                writer.writerow(
                    {
                        "concept_slug": concept["slug"],
                        "concept_zh": info[0],
                        "concept_en": info[1],
                        "family": info[2],
                        "expert_rank": expert["rank"],
                        "expert_zh": expert["name_zh"],
                        "expert_en": expert["name_en"],
                        "relation": concept["relation"],
                    }
                )


def write_markdown(experts):
    rows = []
    for expert in experts:
        concepts = []
        for concept in expert["concepts"][:4]:
            name_zh = CONCEPTS.get(concept["slug"], (concept["slug"], "", ""))[0]
            concepts.append(name_zh)
        rows.append(
            f"| {expert['rank']} | {expert['name_zh']} | {expert['name_en']} | {', '.join(concepts)} | {total_score(expert)} |"
        )

    content = "\n".join(
        [
            "# 股票技術分析專家資料庫索引",
            "",
            "建立日期：2026-06-21",
            "",
            "這是第一版本地研究種子資料，收錄 100 位與股票技術分析、技術指標、圖表方法、量價研究、CMT/Dow Award 文獻或實證技術分析有關的人物。",
            "",
            "## 檔案",
            "",
            "- `technical_analysis_experts.sqlite`：可查詢資料庫。",
            "- `technical_analysis_experts.csv`：人物總表，可用 Excel 開啟。",
            "- `technical_analysis_expert_concepts.csv`：指標/方法對應專家表。",
            "- `technical_analysis_experts_seed.json`：完整原始種子資料。",
            "",
            "## 評分欄位",
            "",
            "每位人物暫以 5 個 0-5 分欄位評估：書籍/文獻、研究論文、公開知名度、指標專屬性、股票技術分析相關度。分數是資料庫排序的工作標籤，不是學術定論。",
            "",
            "## 100 位索引",
            "",
            "| # | 中文名 | English | 主要指標/方法 | 總分 |",
            "|---:|---|---|---|---:|",
            *rows,
            "",
        ]
    )
    MARKDOWN_PATH.write_text(content, encoding="utf-8")


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    validate()
    sorted_experts = sorted(EXPERTS, key=lambda item: item["rank"])
    write_seed_json(sorted_experts)
    build_sqlite(sorted_experts)
    write_csvs(sorted_experts)
    write_markdown(sorted_experts)
    print(f"experts={len(sorted_experts)}")
    print(f"sqlite={DB_PATH}")
    print(f"csv={EXPERT_CSV_PATH}")
    print(f"concept_csv={CONCEPT_CSV_PATH}")
    print(f"markdown={MARKDOWN_PATH}")


if __name__ == "__main__":
    main()
