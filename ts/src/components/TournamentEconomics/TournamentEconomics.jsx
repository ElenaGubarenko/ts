import { useState } from 'react';
import styles from './TournamentEconomics.module.scss';

const formatNumber = (value) => new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
}).format(Number(value) || 0);

const formatMoney = (value, currency = 'EUR') => 
    `${formatNumber(value)} ${currency}`;

const translations = {
    ru: {
        parameters: 'Параметры',
        averageBet: 'Средняя ставка',
        rtp: 'RTP, %',
        completionRate: 'Дистанция турнира',
        completionRateHint: 'Процент выполнения пакета заданий',
        financialGoals: 'Цели',
        desiredIncome: 'Доход, EUR',
        desiredIncomeHint: 'Ожидаемый доход',
        prizePool: 'Призы, EUR',
        prizePoolHint: 'Призовой фонд (часть ожидаемого дохода)',
        scenarios: 'Сценарии',
        scenario: 'Сценарий',
        participants: 'участников',
        participantsLabel: 'уч.',
        spins: 'спинов',
        netIncomePerPlayer: 'Доход/игрок',
        turnover: 'Оборот',
        netIncome: 'Чистый доход',
        margin: 'Маржа',
        formula1Title: 'Доход с одного игрока',
        formula1Desc: 'Сколько зарабатываем с каждого участника',
        formula1: 'ставка × спины × 4%',
        formula1Hint: '4% — это комиссия казино при RTP 96%. Например: ставка 0.2 EUR × 100 спинов × 0.04 = 0.8 EUR с игрока',
        formula2Title: 'Сколько нужно спинов',
        formula2Desc: 'Дистанция, которую должен пройти игрок',
        formula2: 'доход с игрока ÷ (ставка × 4%)',
        formula2Hint: 'Например: нужно заработать 5 EUR с игрока. При ставке 0.2 EUR: 5 ÷ (0.2 × 0.04) = 625 спинов',
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
        parameters: 'Parameters',
        averageBet: 'Avg bet',
        rtp: 'RTP, %',
        completionRate: 'Tournament distance',
        completionRateHint: 'Percentage of task package completion',
        financialGoals: 'Goals',
        desiredIncome: 'Income, EUR',
        desiredIncomeHint: 'Expected income',
        prizePool: 'Prizes, EUR',
        prizePoolHint: 'Prize pool (part of expected income)',
        scenarios: 'Scenarios',
        scenario: 'Scenario',
        participants: 'participants',
        participantsLabel: 'part.',
        spins: 'spins',
        netIncomePerPlayer: 'Income/player',
        turnover: 'Turnover',
        netIncome: 'Net income',
        margin: 'Margin',
        formula1Title: 'Income per player',
        formula1Desc: 'How much we earn from each participant',
        formula1: 'bet × spins × 4%',
        formula1Hint: '4% is the casino commission at 96% RTP. Example: bet 0.2 EUR × 100 spins × 0.04 = 0.8 EUR per player',
        formula2Title: 'Required spins',
        formula2Desc: 'Distance the player must complete',
        formula2: 'income per player ÷ (bet × 4%)',
        formula2Hint: 'Example: need to earn 5 EUR per player. At 0.2 EUR bet: 5 ÷ (0.2 × 0.04) = 625 spins',
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
        input: 'rgba(117, 103, 232, 0.2)', 
        inputBorder: 'rgba(117, 103, 232, 0.5)',
        card: 'rgba(117, 103, 232, 0.08)',
        cardBorder: 'rgba(117, 103, 232, 0.25)',
        accent: '#a99ff5'
    },
    { 
        input: 'rgba(53, 198, 181, 0.15)', 
        inputBorder: 'rgba(53, 198, 181, 0.5)',
        card: 'rgba(53, 198, 181, 0.08)',
        cardBorder: 'rgba(53, 198, 181, 0.25)',
        accent: '#7ed1c7'
    },
    { 
        input: 'rgba(100, 143, 179, 0.15)', 
        inputBorder: 'rgba(100, 143, 179, 0.5)',
        card: 'rgba(100, 143, 179, 0.08)',
        cardBorder: 'rgba(100, 143, 179, 0.25)',
        accent: '#8fb3d9'
    },
];

function TournamentEconomics() {
    const [language, setLanguage] = useState('ru');
    // Храним значения как строки, чтобы можно было очистить поле
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
        scenarios[index] = value; // Сохраняем как строку
        setMarginParticipantScenarios(scenarios);
    };

    const handleIncomeChange = (value) => {
        setDesiredTournamentIncome(value);
        const income = Number(value) || 0;
        // Устанавливаем prizePool только если value не пустое
        setPrizePool(value === '' ? '' : String(income * 0.5));
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSavePdf = async () => {
        setIsSaving(true);
        
        try {
            // Динамически импортируем библиотеки
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');
            
            const element = document.querySelector(`.${styles.page}`);
            
            // Создаем canvas из элемента
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#10141b',
            });
            
            // Получаем размеры
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            // Создаем PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Если изображение больше одной страницы, масштабируем
            if (imgHeight <= pageHeight) {
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            } else {
                // Масштабируем, чтобы влезло на одну страницу
                const scale = Math.min(imgWidth / canvas.width, pageHeight / canvas.height);
                const scaledWidth = canvas.width * scale;
                const scaledHeight = canvas.height * scale;
                const x = (imgWidth - scaledWidth) / 2;
                const y = (pageHeight - scaledHeight) / 2;
                
                pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
            }
            
            // Сохраняем PDF
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
    const marginRate = (100 - rtp) / 100; // 0.04 при RTP 96%
    const netIncome = Math.max(0, targetIncome - targetPrizePool);

    const calculateScenario = (participantsStr) => {
        const participants = Number(participantsStr) || 0;
        
        // Чистый доход с одного игрока (не зависит от процента выполнения)
        const netIncomePerPlayer = participants > 0 ? netIncome / participants : 0;
        
        // Спины = доход с игрока / (ставка × маржа)
        const spinsPerPlayer = bet > 0 && marginRate > 0
            ? netIncomePerPlayer / (bet * marginRate)
            : 0;

        // Оборот с учетом процента выполнения дистанции
        const turnover = participants * spinsPerPlayer * bet * completionRate / 100;
        
        // Общий доход = оборот × маржа
        const grossRevenue = turnover * marginRate;
        
        const marginRatio = marginRate * 100;

        return {
            participants,
            netIncomePerPlayer,
            spinsPerPlayer,
            turnover,
            grossRevenue,
            marginRatio,
        };
    };

    return (
        <div className={styles.document}>
            <div className={styles.toolbar}>
                <div>
                    <span>Сводный документ</span>
                    <h2>Экономика турнира</h2>
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
                    <header>
                        <div>
                            <span>TOURNAMENT-STUDIO · TOURNAMENT</span>
                            <h3>Экономика и маржа</h3>
                        </div>
                        <strong>01/01</strong>
                    </header>

                    {/* Основные параметры */}
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

                    {/* Сценарии на отдельной строке */}
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

                    {/* Карточки сценариев с цветовой кодировкой */}
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
                                    <span style={{ color: colors.accent }}>
                                        {t.scenario} {index + 1} · {formatNumber(scenario.participants)} {t.participantsLabel}
                                    </span>
                                    <strong style={{ color: colors.accent }}>
                                        {formatNumber(scenario.spinsPerPlayer)} {t.spins}
                                    </strong>
                                    <dl>
                                        <div>
                                            <dt>{t.netIncomePerPlayer}</dt>
                                            <dd>{formatMoney(scenario.netIncomePerPlayer)}</dd>
                                        </div>
                                        <div>
                                            <dt>{t.turnover}</dt>
                                            <dd>{formatMoney(scenario.turnover)}</dd>
                                        </div>
                                        <div>
                                            <dt>{t.netIncome}</dt>
                                            <dd>{formatMoney(scenario.grossRevenue)}</dd>
                                        </div>
                                        <div>
                                            <dt>{t.margin}</dt>
                                            <dd>{formatNumber(scenario.marginRatio)}%</dd>
                                        </div>
                                    </dl>
                                </article>
                            );
                        })}
                    </div>

                    {/* Формулы с понятными объяснениями */}
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