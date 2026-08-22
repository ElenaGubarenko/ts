import { useState } from 'react';
import styles from './TournamentEconomics.module.scss';

const formatNumber = (value) => new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
}).format(Number(value) || 0);

const formatMoney = (value, currency = 'EUR') => 
    `${formatNumber(value)} ${currency}`;

const translations = {
    ru: {
        documentLabel: 'Сводный документ',
        documentTitle: 'Экономика турнира',
        pageTitle: 'Экономика и маржа',
        parameters: 'Параметры',
        averageBet: 'Минимальная ставка',
        averageBetHint: 'Рекомендуется указывать средний размер ставки за последние полгода, увеличенный на 10-20%',
        rtp: 'RTP, %',
        rtpHint: 'Средний RTP по играм, участвующим в турнире',
        completionRate: 'Дистанция турнира',
        completionRateHint: 'Процент выполнения пакета заданий',
        financialGoals: 'Цели',
        desiredIncome: 'Доход, EUR',
        desiredIncomeHint: 'Ожидаемый чистый доход, из которого будет выплачен призовой фонд',
        prizePool: 'Призы, EUR',
        prizePoolHint: 'Призовой фонд (часть ожидаемого дохода)',
        scenarios: 'Сценарии',
        scenario: 'Сценарий',
        participants: 'участников',
        participantsLabel: 'уч.',
        spins: 'спинов',
        spinsPerPlayer: 'спинов на игрока',
        spinsTotal: 'спинов всего',
        netIncomePerPlayer: 'Доход/игрок',
        netIncomeAll: 'Доход всего',
        turnover: 'Оборот',
        turnoverPerPlayer: 'Оборот/игрок',
        turnoverAll: 'Оборот всего',
        netIncome: 'Чистый доход',
        netIncomePerPlayerFull: 'Чистый доход/игрок',
        netIncomeAll: 'Чистый доход всего',
        margin: 'Маржа',
        formula1Title: 'Расчет ожидаемого дохода',
        formula1Desc: 'Сколько зарабатываем с каждого участника',
        formula1: 'ставка × спины × 4%',
        formula1Hint: '4% — комиссия при RTP 96%',
        formula2Title: 'Расчет необходимого кол-ва спинов',
        formula2Desc: 'Дистанция, которую должен пройти игрок',
        formula2: 'ожидаемый доход ÷ (ставка × 4%)',
        formula2Hint: 'Пример: 5 EUR ÷ (0.2 × 0.04) = 625 спинов',
        disclaimer1: '* Параметры сценария не добавляются в конфиг турнира.',
        disclaimer2: '** Расчет не учитывает повторные попытки, бонусные покупки и операционные расходы.',
        print: 'Печать',
        savePdf: 'Сохранить PDF',
        fileName: 'экономика-турнира',
        legend1: 'Доход/игрок — чистый доход с одного участника',
        legend2: 'Оборот — сумма всех ставок',
        legend3: 'Чистый доход — общий доход после выплаты призов',
        legend4: 'Маржа — 4% от каждой ставки (при RTP 96%)',
    },
    en: {
        documentLabel: 'Summary Document',
        documentTitle: 'Tournament Economics',
        pageTitle: 'Economics and Margin',
        parameters: 'Parameters',
        averageBet: 'Min bet',
        averageBetHint: 'Recommended to use average bet size for the last 6 months, increased by 10-20%',
        rtp: 'RTP, %',
        rtpHint: 'Average RTP across games participating in the tournament',
        completionRate: 'Tournament distance',
        completionRateHint: 'Percentage of task package completion',
        financialGoals: 'Goals',
        desiredIncome: 'Income, EUR',
        desiredIncomeHint: 'Expected net income from which the prize pool will be paid',
        prizePool: 'Prizes, EUR',
        prizePoolHint: 'Prize pool (part of expected income)',
        scenarios: 'Scenarios',
        scenario: 'Scenario',
        participants: 'participants',
        participantsLabel: 'part.',
        spins: 'spins',
        spinsPerPlayer: 'spins per player',
        spinsTotal: 'total spins',
        netIncomePerPlayer: 'Income/player',
        netIncomeAll: 'Total income',
        turnover: 'Turnover',
        turnoverPerPlayer: 'Turnover/player',
        turnoverAll: 'Total turnover',
        netIncome: 'Net income',
        netIncomePerPlayerFull: 'Net income/player',
        netIncomeAll: 'Total net income',
        margin: 'Margin',
        formula1Title: 'Expected income calculation',
        formula1Desc: 'How much we earn from each participant',
        formula1: 'bet × spins × 4%',
        formula1Hint: '4% is the commission at 96% RTP',
        formula2Title: 'Required spins calculation',
        formula2Desc: 'Distance the player must complete',
        formula2: 'expected income ÷ (bet × 4%)',
        formula2Hint: 'Example: 5 EUR ÷ (0.2 × 0.04) = 625 spins',
        disclaimer1: '* Scenario params are not added to tournament config.',
        disclaimer2: '** Calculation excludes retries, bonus buys and operational costs.',
        print: 'Print',
        savePdf: 'Save PDF',
        fileName: 'tournament-economics',
        legend1: 'Income/player — net income per participant',
        legend2: 'Turnover — total bets sum',
        legend3: 'Net income — total income after prize payouts',
        legend4: 'Margin — 4% from each bet (at 96% RTP)',
    },
};

// Цвета для сценариев
const scenarioColors = [
    { 
        input: 'rgba(117, 103, 232, 0.15)', 
        inputBorder: 'rgba(117, 103, 232, 0.4)',
        card: 'rgba(117, 103, 232, 0.06)',
        cardBorder: 'rgba(117, 103, 232, 0.2)',
        accent: '#a99ff5',
        headerBg: 'rgba(117, 103, 232, 0.12)'
    },
    { 
        input: 'rgba(53, 198, 181, 0.12)', 
        inputBorder: 'rgba(53, 198, 181, 0.4)',
        card: 'rgba(53, 198, 181, 0.06)',
        cardBorder: 'rgba(53, 198, 181, 0.2)',
        accent: '#7ed1c7',
        headerBg: 'rgba(53, 198, 181, 0.12)'
    },
    { 
        input: 'rgba(100, 143, 179, 0.12)', 
        inputBorder: 'rgba(100, 143, 179, 0.4)',
        card: 'rgba(100, 143, 179, 0.06)',
        cardBorder: 'rgba(100, 143, 179, 0.2)',
        accent: '#8fb3d9',
        headerBg: 'rgba(100, 143, 179, 0.12)'
    },
];

function TournamentEconomics() {
    const [language, setLanguage] = useState('ru');
    const [averageBet, setAverageBet] = useState('0.2');
    const [expectedRtp, setExpectedRtp] = useState('96');
    const [participantCompletionRate, setParticipantCompletionRate] = useState('100');
    const [desiredTournamentIncome, setDesiredTournamentIncome] = useState('10000');
    const [prizePool, setPrizePool] = useState('5000');
    const [marginParticipantScenarios, setMarginParticipantScenarios] = useState([
        '500', '1000', '5000',
    ]);
    const [isSaving, setIsSaving] = useState(false);

    const t = translations[language];

    const updateScenario = (index, value) => {
        const scenarios = [...marginParticipantScenarios];
        scenarios[index] = value;
        setMarginParticipantScenarios(scenarios);
    };

    const handleIncomeChange = (value) => {
        setDesiredTournamentIncome(value);
        const income = Number(value) || 0;
        setPrizePool(value === '' ? '' : String(income * 0.5));
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSavePdf = async () => {
        setIsSaving(true);
        
        try {
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');
            
            const element = document.querySelector(`.${styles.page}`);
            
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#10141b',
            });
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            if (imgHeight <= pageHeight) {
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            } else {
                const scale = Math.min(imgWidth / canvas.width, pageHeight / canvas.height);
                const scaledWidth = canvas.width * scale;
                const scaledHeight = canvas.height * scale;
                const x = (imgWidth - scaledWidth) / 2;
                const y = (pageHeight - scaledHeight) / 2;
                
                pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
            }
            
            pdf.save(`${t.fileName}.pdf`);
            
        } catch (error) {
            console.error('Ошибка при сохранении PDF:', error);
            alert('Не удалось сохранить PDF. Пожалуйста, попробуйте еще раз.');
        } finally {
            setIsSaving(false);
        }
    };

    const rtp = Math.min(100, Math.max(0, Number(expectedRtp) || 0));
    const completionRate = Math.max(0, Number(participantCompletionRate) || 0);
    const targetIncome = Number(desiredTournamentIncome) || 0;
    const targetPrizePool = Number(prizePool) || 0;
    const bet = Number(averageBet) || 0;
    const marginRate = (100 - rtp) / 100;
    const netIncome = Math.max(0, targetIncome - targetPrizePool);

    const calculateScenario = (participantsStr) => {
        const participants = Number(participantsStr) || 0;
        
        const netIncomePerPlayer = participants > 0 ? netIncome / participants : 0;
        
        const spinsPerPlayer = bet > 0 && marginRate > 0
            ? netIncomePerPlayer / (bet * marginRate)
            : 0;

        const turnoverPerPlayer = spinsPerPlayer * bet * completionRate / 100;
        const turnoverAll = turnoverPerPlayer * participants;
        
        const grossRevenuePerPlayer = turnoverPerPlayer * marginRate;
        const grossRevenueAll = grossRevenuePerPlayer * participants;
        
        const totalSpins = spinsPerPlayer * participants;
        
        const marginRatio = marginRate * 100;

        return {
            participants,
            netIncomePerPlayer,
            spinsPerPlayer,
            totalSpins,
            turnoverPerPlayer,
            turnoverAll,
            grossRevenuePerPlayer,
            grossRevenueAll,
            marginRatio,
        };
    };

    return (
        <div className={styles.document}>
            <div className={styles.toolbar}>
                <div>
                    <span>{t.documentLabel}</span>
                    <h2>{t.documentTitle}</h2>
                </div>
                <div className={styles.toolbarActions}>
                    <button
                        className={language === 'ru' ? styles.active : ''}
                        type="button"
                        onClick={() => setLanguage('ru')}
                    >
                        RU
                    </button>
                    <button
                        className={language === 'en' ? styles.active : ''}
                        type="button"
                        onClick={() => setLanguage('en')}
                    >
                        EN
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSavePdf}
                        className={styles.saveButton}
                        disabled={isSaving}
                    >
                        {isSaving ? '...' : t.savePdf}
                    </button>
                    <button type="button" onClick={handlePrint}>
                        {t.print}
                    </button>
                </div>
            </div>

            <div className={styles.pages}>
                <article className={`${styles.page} ${styles.visible}`}>
                    <section className={styles.section}>
                        <h4 className={styles.sectionTitle}>{t.parameters}</h4>
                        <div className={styles.modelInputs}>
                            <label>
                                <span>{t.averageBet}</span>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={averageBet}
                                    onChange={(e) => setAverageBet(e.target.value)}
                                    placeholder="0"
                                />
                                <small>{t.averageBetHint}</small>
                            </label>
                            <label>
                                <span>{t.rtp}</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={expectedRtp}
                                    onChange={(e) => setExpectedRtp(e.target.value)}
                                    placeholder="0"
                                />
                                <small>{t.rtpHint}</small>
                            </label>
                            <label>
                                <span>{t.completionRate}</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={participantCompletionRate}
                                    onChange={(e) => setParticipantCompletionRate(e.target.value)}
                                    placeholder="0"
                                />
                                <small>{t.completionRateHint}</small>
                            </label>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h4 className={styles.sectionTitle}>{t.financialGoals}</h4>
                        <div className={styles.financialInputs}>
                            <label>
                                <span>{t.desiredIncome}</span>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={desiredTournamentIncome}
                                    onChange={(e) => handleIncomeChange(e.target.value)}
                                    placeholder="0"
                                />
                                <small>{t.desiredIncomeHint}</small>
                            </label>
                            <label>
                                <span>{t.prizePool}</span>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={prizePool}
                                    onChange={(e) => setPrizePool(e.target.value)}
                                    placeholder="0"
                                />
                                <small>{t.prizePoolHint}</small>
                            </label>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h4 className={styles.sectionTitle}>{t.scenarios}</h4>
                        <div className={styles.scenarioInputs}>
                            {marginParticipantScenarios.map((participants, index) => (
                                <label 
                                    key={`scenario-${index}`}
                                    style={{
                                        background: scenarioColors[index].input,
                                        borderColor: scenarioColors[index].inputBorder,
                                    }}
                                >
                                    <span style={{ color: scenarioColors[index].accent }}>
                                        {t.scenario} {index + 1}
                                    </span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={participants}
                                        onChange={(e) => updateScenario(index, e.target.value)}
                                        placeholder="0"
                                        style={{
                                            borderColor: scenarioColors[index].inputBorder,
                                        }}
                                    />
                                    <small>{t.participants}</small>
                                </label>
                            ))}
                        </div>
                    </section>

                    <div className={styles.economicsGrid}>
                        {marginParticipantScenarios.map((participants, index) => {
                            const scenario = calculateScenario(participants);
                            const colors = scenarioColors[index];
                            
                            return (
                                <article 
                                    key={`margin-${index}`}
                                    style={{
                                        background: colors.card,
                                        borderColor: colors.cardBorder,
                                    }}
                                >
                                    <div 
                                        className={styles.cardHeader}
                                        style={{
                                            background: colors.headerBg,
                                            borderBottom: `1px solid ${colors.cardBorder}`
                                        }}
                                    >
                                        <span style={{ color: colors.accent }}>
                                            {t.scenario} {index + 1} · {formatNumber(scenario.participants)} {t.participantsLabel}
                                        </span>
                                        <strong style={{ color: colors.accent }}>
                                            {formatNumber(scenario.spinsPerPlayer)} {t.spinsPerPlayer}
                                            <small className={styles.totalValue}>
                                                ({formatNumber(scenario.totalSpins)} {t.spinsTotal})
                                            </small>
                                        </strong>
                                    </div>
                                    <dl>
                                        <div>
                                            <dt>{t.netIncomePerPlayer}</dt>
                                            <dd>
                                                <span className={styles.mainValue}>
                                                    {formatMoney(scenario.netIncomePerPlayer)}
                                                </span>
                                                <span className={styles.subValue}>
                                                    {formatMoney(scenario.grossRevenuePerPlayer)} · {t.netIncomePerPlayerFull}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>{t.turnover}</dt>
                                            <dd>
                                                <span className={styles.mainValue}>
                                                    {formatMoney(scenario.turnoverPerPlayer)}
                                                </span>
                                                <span className={styles.subValue}>
                                                    {formatMoney(scenario.turnoverAll)} · {t.turnoverAll}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>{t.netIncome}</dt>
                                            <dd>
                                                <span className={styles.mainValue}>
                                                    {formatMoney(scenario.grossRevenuePerPlayer)}
                                                </span>
                                                <span className={styles.subValue}>
                                                    {formatMoney(scenario.grossRevenueAll)} · {t.netIncomeAll}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>{t.margin}</dt>
                                            <dd>
                                                <span className={styles.mainValue}>
                                                    {formatNumber(scenario.marginRatio)}%
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>
                                </article>
                            );
                        })}
                    </div>

                    <div className={styles.economicsFormula}>
                        <div>
                            <span>01 · {t.formula1Title}</span>
                            <strong>{t.formula1Desc}</strong>
                            <code>{t.formula1}</code>
                            <p>{t.formula1Hint}</p>
                        </div>
                        <div>
                            <span>02 · {t.formula2Title}</span>
                            <strong>{t.formula2Desc}</strong>
                            <code>{t.formula2}</code>
                            <p>{t.formula2Hint}</p>
                        </div>
                    </div>

                    <div className={styles.legend}>
                        <span>{t.legend1}</span>
                        <span>{t.legend2}</span>
                        <span>{t.legend3}</span>
                        <span>{t.legend4}</span>
                    </div>

                    <div className={styles.disclaimer}>
                        <p>{t.disclaimer1}</p>
                        <p>{t.disclaimer2}</p>
                    </div>
                </article>
            </div>
        </div>
    );
}

export default TournamentEconomics;