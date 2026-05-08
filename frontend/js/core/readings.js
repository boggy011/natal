/**
 * Client-side life-topic readings.
 * Ported from backend/core/life_readings.py — all interpretation data in JS.
 */

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

function signAt(lon) { return SIGNS[Math.floor(lon / 30) % 12]; }
function findPlanet(chart, name) { return chart.planets.find(p => p.name === name); }
function pick(dict, key, lang) {
  const idx = lang === "sr" ? 1 : lang === "de" ? 2 : 0;
  return dict[key]?.[idx] || "";
}

// ── LOVE: Venus in sign ─────────────────────────────────────────────────
const VENUS_SIGN = {
  Aries:       ["You love with fire and intensity. Passion ignites fast, and you need excitement, spontaneity, and a partner who can match your bold energy.","Volite vatreno i intenzivno. Strast se brzo pali, a potrebno vam je uzbuđenje, spontanost i partner koji može da prati vašu hrabru energiju.","Du liebst mit Feuer und Intensität. Leidenschaft entflammt schnell, und du brauchst Aufregung, Spontaneität und einen Partner, der deiner mutigen Energie gewachsen ist."],
  Taurus:      ["You love deeply and steadily. Physical affection, loyalty, and comfort matter most. You build lasting bonds through patience and sensual devotion.","Volite duboko i postojano. Fizička nežnost, lojalnost i udobnost su vam najvažniji. Gradite trajne veze kroz strpljenje i čulnu posvećenost.","Du liebst tief und beständig. Körperliche Zuneigung, Treue und Geborgenheit sind dir am wichtigsten. Du baust dauerhafte Bindungen durch Geduld und sinnliche Hingabe auf."],
  Gemini:      ["You love through words, wit, and intellectual connection. Variety keeps your heart alive. A partner who stimulates your mind wins your affection.","Volite kroz reči, duhovitost i intelektualnu povezanost. Raznolikost održava vaše srce živim. Partner koji stimuliše vaš um osvaja vaše srce.","Du liebst durch Worte, Witz und geistige Verbindung. Abwechslung hält dein Herz lebendig. Ein Partner, der deinen Geist anregt, gewinnt deine Zuneigung."],
  Cancer:      ["You love with nurturing depth and emotional devotion. Security and a sense of home in your partner are essential. Your love is protective and enduring.","Volite sa brižnom dubinom i emocionalnom posvećenošću. Sigurnost i osećaj doma u partneru su vam neophodni. Vaša ljubav je zaštitnička i trajna.","Du liebst mit fürsorglicher Tiefe und emotionaler Hingabe. Sicherheit und ein Gefühl von Zuhause beim Partner sind dir wesentlich. Deine Liebe ist beschützend und beständig."],
  Leo:         ["You love grandly and generously. Romance, admiration, and creative expression fuel your heart. You need a partner who celebrates you as you celebrate them.","Volite velikodušno i veličanstveno. Romantika, divljenje i kreativno izražavanje hrane vaše srce. Potreban vam je partner koji vas slavi kao što vi slavite njega.","Du liebst großzügig und grandios. Romantik, Bewunderung und kreativer Ausdruck nähren dein Herz. Du brauchst einen Partner, der dich feiert, wie du ihn feierst."],
  Virgo:       ["You love through acts of service and quiet devotion. You notice the small things and show care through practical support. Reliability is your love language.","Volite kroz dela služenja i tihu posvećenost. Primećujete male stvari i pokazujete brigu kroz praktičnu podršku. Pouzdanost je vaš jezik ljubavi.","Du liebst durch Taten der Fürsorge und stille Hingabe. Du bemerkst die kleinen Dinge und zeigst Zuneigung durch praktische Unterstützung. Zuverlässigkeit ist deine Liebessprache."],
  Libra:       ["You love with grace, harmony, and a deep desire for partnership. Beauty and balance in relationships are essential. You thrive when love feels like a true equal exchange.","Volite sa gracioznošću, harmonijom i dubokom željom za partnerstvom. Lepota i ravnoteža u odnosima su vam neophodni. Napredujete kada ljubav deluje kao istinska razmena.","Du liebst mit Anmut, Harmonie und einem tiefen Wunsch nach Partnerschaft. Schönheit und Gleichgewicht in Beziehungen sind dir wesentlich."],
  Scorpio:     ["You love with transformative intensity. Emotional depth, trust, and soul-level bonding are non-negotiable. Superficial connections leave you cold — you crave all or nothing.","Volite sa transformativnom snagom. Emocionalna dubina, poverenje i povezivanje na nivou duše su nepokolebljivi. Površne veze vas ostavljaju hladnim — želite sve ili ništa.","Du liebst mit transformativer Intensität. Emotionale Tiefe, Vertrauen und Seelenbindung sind unverzichtbar. Oberflächliche Verbindungen lassen dich kalt — du sehnst dich nach Alles oder Nichts."],
  Sagittarius: ["You love with optimism, adventure, and philosophical openness. Freedom within partnership is vital. A shared love for exploration and growth keeps your flame alive.","Volite sa optimizmom, avanturom i filozofskom otvorenošću. Sloboda unutar partnerstva je vitalna. Zajednička ljubav prema istraživanju i rastu održava vaš plamen.","Du liebst mit Optimismus, Abenteuerlust und philosophischer Offenheit. Freiheit innerhalb der Partnerschaft ist lebenswichtig."],
  Capricorn:   ["You love with commitment, ambition, and quiet strength. You take relationships seriously and build love like you build everything — with endurance and long-term vision.","Volite sa posvećenošću, ambicijom i tihom snagom. Ozbiljno shvatate veze i gradite ljubav kao što gradite sve — sa istrajnošću i dugoročnom vizijom.","Du liebst mit Hingabe, Ehrgeiz und stiller Stärke. Du nimmst Beziehungen ernst und baust Liebe auf, wie du alles aufbaust — mit Ausdauer und langfristiger Vision."],
  Aquarius:    ["You love with originality and intellectual freedom. Friendship is the foundation of your romantic bonds. You need space to be yourself and a partner who respects your individuality.","Volite sa originalnošću i intelektualnom slobodom. Prijateljstvo je temelj vaših romantičnih veza. Potreban vam je prostor da budete svoji i partner koji poštuje vašu individualnost.","Du liebst mit Originalität und geistiger Freiheit. Freundschaft ist das Fundament deiner romantischen Bindungen."],
  Pisces:      ["You love with boundless compassion, imagination, and spiritual sensitivity. You merge deeply with your partner and seek a love that transcends the ordinary.","Volite sa beskrajnim saosećanjem, maštom i duhovnom osetljivošću. Duboko se spajate sa partnerom i tražite ljubav koja prevazilazi obično.","Du liebst mit grenzenlosem Mitgefühl, Fantasie und spiritueller Sensibilität. Du verschmilzt tief mit deinem Partner und suchst eine Liebe, die das Gewöhnliche übersteigt."],
};

const MOON_LOVE = {
  Aries:       ["Emotionally, you need directness and independence. You process feelings quickly and want a partner who doesn't shy away from honest confrontation.","Emocionalno, potrebna vam je direktnost i nezavisnost. Brzo obrađujete osećanja i želite partnera koji se ne plaši iskrenog suočavanja.","Emotional brauchst du Direktheit und Unabhängigkeit. Du verarbeitest Gefühle schnell und wünschst dir einen Partner, der ehrlicher Konfrontation nicht ausweicht."],
  Taurus:      ["Your emotional world craves stability and physical comfort. Touch, routine, and a serene home environment make you feel loved and secure.","Vaš emocionalni svet čezne za stabilnošću i fizičkom udobnošću. Dodir, rutina i mirno kućno okruženje čine da se osećate voljeno i sigurno.","Deine emotionale Welt sehnt sich nach Stabilität und körperlichem Wohlbehagen."],
  Gemini:      ["You need constant mental stimulation to feel emotionally connected. Talking, sharing ideas, and humor are your primary emotional outlets.","Potrebna vam je stalna mentalna stimulacija da biste se osećali emocionalno povezano. Razgovor, deljenje ideja i humor su vaši primarni emocionalni ventili.","Du brauchst ständige geistige Anregung, um dich emotional verbunden zu fühlen."],
  Cancer:      ["Your emotional needs are deep and protective. You need to feel safe before opening up, and you nurture your loved ones with fierce devotion.","Vaše emocionalne potrebe su duboke i zaštitničke. Morate se osećati bezbedno pre nego što se otvorite.","Deine emotionalen Bedürfnisse sind tief und beschützend. Du musst dich sicher fühlen, bevor du dich öffnest."],
  Leo:         ["You need to feel admired and emotionally appreciated. Your heart opens wide when your partner celebrates your uniqueness and showers you with warmth.","Morate se osećati obožavano i emocionalno cenjeno. Vaše srce se široko otvara kada partner slavi vašu jedinstvenost.","Du musst dich bewundert und emotional geschätzt fühlen."],
  Virgo:       ["You show love through practical care and feel loved when others notice your efforts. Emotional order and a sense of being useful ground your heart.","Ljubav pokazujete kroz praktičnu brigu i osećate se voljeno kada drugi primete vaše napore.","Du zeigst Liebe durch praktische Fürsorge und fühlst dich geliebt, wenn andere deine Bemühungen bemerken."],
  Libra:       ["You feel emotionally fulfilled through harmony and partnership. Conflict drains you; beauty and grace in your emotional environment restore you.","Osećate se emocionalno ispunjeno kroz harmoniju i partnerstvo. Konflikti vas iscrpljuju.","Du fühlst dich emotional erfüllt durch Harmonie und Partnerschaft. Konflikte erschöpfen dich."],
  Scorpio:     ["Your emotional life runs deep and intense. You need absolute trust and emotional honesty. Half-hearted connections feel unbearable.","Vaš emocionalni život je dubok i intenzivan. Potrebno vam je apsolutno poverenje i emocionalna iskrenost.","Dein emotionales Leben ist tief und intensiv. Du brauchst absolutes Vertrauen und emotionale Ehrlichkeit."],
  Sagittarius: ["You need emotional freedom and adventure. Feeling trapped kills your spirit. You're happiest when love is combined with exploration and shared meaning.","Potrebna vam je emocionalna sloboda i avantura. Osećaj zarobljenosti ubija vaš duh.","Du brauchst emotionale Freiheit und Abenteuer. Sich gefangen zu fühlen tötet deinen Geist."],
  Capricorn:   ["You guard your emotions carefully and need a partner who proves their reliability over time. Your love deepens slowly but becomes unshakable once rooted.","Pažljivo čuvate svoja osećanja i potreban vam je partner koji dokazuje svoju pouzdanost vremenom.","Du hütest deine Emotionen sorgfältig und brauchst einen Partner, der seine Zuverlässigkeit beweist."],
  Aquarius:    ["You need emotional space and intellectual rapport. You love deeply but unconventionally, and need a partner who doesn't try to possess or define you.","Potreban vam je emocionalni prostor i intelektualni sklad. Volite duboko, ali nekonvencionalno.","Du brauchst emotionalen Freiraum und intellektuellen Gleichklang."],
  Pisces:      ["Your emotional world is vast, intuitive, and deeply empathic. You absorb your partner's feelings and need love that feels like a spiritual sanctuary.","Vaš emocionalni svet je ogroman, intuitivan i duboko empatičan. Upijate osećanja partnera.","Deine emotionale Welt ist weit, intuitiv und zutiefst empathisch."],
};

const DSC_SIGN = {
  Aries:       ["You are attracted to bold, assertive partners who push you out of your comfort zone and ignite your competitive spirit.","Privlače vas hrabri, asertivni partneri koji vas izbacuju iz zone komfora.","Du fühlst dich zu mutigen, durchsetzungsstarken Partnern hingezogen."],
  Taurus:      ["You seek a grounded, reliable partner who brings stability and sensual pleasure into your life.","Tražite uzemljenog, pouzdanog partnera koji donosi stabilnost i čulno zadovoljstvo.","Du suchst einen geerdeten, verlässlichen Partner, der Stabilität bringt."],
  Gemini:      ["You are drawn to witty, communicative partners who keep life intellectually stimulating and never boring.","Privlače vas duhoviti, komunikativni partneri koji život čine intelektualno stimulativnim.","Du fühlst dich zu witzigen, kommunikativen Partnern hingezogen."],
  Cancer:      ["You seek emotionally attuned, nurturing partners who create a feeling of home wherever they are.","Tražite emocionalno usklađene, brižne partnere koji stvaraju osećaj doma gde god da su.","Du suchst emotional eingestimmte, fürsorgende Partner."],
  Leo:         ["You are attracted to confident, warm-hearted partners who bring drama, creativity, and passionate expression into your life.","Privlače vas samouvereni, topli partneri koji donose dramu, kreativnost i strastveni izraz.","Du fühlst dich zu selbstbewussten, warmherzigen Partnern hingezogen."],
  Virgo:       ["You seek thoughtful, detail-oriented partners who show love through practical care and genuine helpfulness.","Tražite pažljive, detaljno orijentisane partnere koji pokazuju ljubav kroz praktičnu brigu.","Du suchst nachdenkliche, detailorientierte Partner."],
  Libra:       ["You are drawn to graceful, diplomatic partners who value fairness and create beauty and balance in your shared life.","Privlače vas graciozni, diplomatski partneri koji cene pravičnost i stvaraju lepotu.","Du fühlst dich zu anmutigen, diplomatischen Partnern hingezogen."],
  Scorpio:     ["You seek intense, transformative partners who are unafraid of emotional depth and can match your need for authenticity.","Tražite intenzivne, transformativne partnere koji se ne plaše emocionalne dubine.","Du suchst intensive, transformative Partner."],
  Sagittarius: ["You are attracted to adventurous, philosophical partners who expand your horizons and share your love of freedom.","Privlače vas avanturistički, filozofski partneri koji šire vaše horizonte.","Du fühlst dich zu abenteuerlustigen, philosophischen Partnern hingezogen."],
  Capricorn:   ["You seek ambitious, mature partners who take life seriously and can build something lasting together with you.","Tražite ambiciozne, zrele partnere koji ozbiljno shvataju život.","Du suchst ehrgeizige, reife Partner."],
  Aquarius:    ["You are drawn to unconventional, intellectually independent partners who value your freedom as much as their own.","Privlače vas nekonvencionalni, intelektualno nezavisni partneri.","Du fühlst dich zu unkonventionellen, geistig unabhängigen Partnern hingezogen."],
  Pisces:      ["You seek compassionate, intuitive partners who bring emotional depth, creativity, and a touch of magic into your life.","Tražite saosećajne, intuitivne partnere koji donose emocionalnu dubinu i dodir magije.","Du suchst mitfühlende, intuitive Partner."],
};

const MC_SIGN = {
  Aries:       ["Your career path favors leadership, entrepreneurship, and pioneering roles. You thrive when you can act independently and make bold decisions.","Vaš karijerni put favorizuje liderstvo, preduzetništvo i pionirske uloge.","Dein Karriereweg begünstigt Führung, Unternehmertum und Pionierrollen."],
  Taurus:      ["Your career is built through patience, persistence, and a talent for creating tangible value. Financial security is a core professional motivation.","Vaša karijera se gradi kroz strpljenje, upornost i talenat za stvaranje opipljive vrednosti.","Deine Karriere baut sich durch Geduld, Beharrlichkeit und ein Talent für greifbare Werte auf."],
  Gemini:      ["Your professional life thrives on communication, versatility, and intellectual engagement. Writing, teaching, media, and connecting people suit you well.","Vaš profesionalni život napreduje kroz komunikaciju, svestranost i intelektualni angažman.","Dein Berufsleben blüht durch Kommunikation, Vielseitigkeit und geistiges Engagement."],
  Cancer:      ["Your career is driven by nurturing, protection, and creating emotional security for others. Real estate, healthcare, and food appeal to you.","Vaša karijera je vođena brigom, zaštitom i stvaranjem emocionalne sigurnosti za druge.","Deine Karriere wird von Fürsorge, Schutz und emotionaler Sicherheit angetrieben."],
  Leo:         ["Your career shines in creative, performative, and leadership roles. You need recognition and a platform for your unique vision and charisma.","Vaša karijera blista u kreativnim, performativnim i liderskim ulogama.","Deine Karriere glänzt in kreativen, darstellerischen und Führungsrollen."],
  Virgo:       ["Your career excels through precision, analysis, and service to others. Healthcare, science, and quality-focused work bring you fulfillment.","Vaša karijera se ističe kroz preciznost, analizu i služenje drugima.","Deine Karriere zeichnet sich durch Präzision, Analyse und Dienst an anderen aus."],
  Libra:       ["Your career thrives in partnerships, diplomacy, and aesthetics. Law, design, counseling, and fields requiring fairness suit your nature.","Vaša karijera napreduje u partnerstvima, diplomatiji i estetici.","Deine Karriere gedeiht in Partnerschaften, Diplomatie und Ästhetik."],
  Scorpio:     ["Your career is powered by intensity, research, and transformation. Psychology, finance, investigation, and roles involving power attract you.","Vaša karijera je pogonjana intenzitetom, istraživanjem i transformacijom.","Deine Karriere wird von Intensität, Forschung und Transformation angetrieben."],
  Sagittarius: ["Your career needs meaning, expansion, and freedom. Education, travel, publishing, and international work align with your professional spirit.","Vaša karijera treba smisao, ekspanziju i slobodu.","Deine Karriere braucht Sinn, Expansion und Freiheit."],
  Capricorn:   ["Your career is built for authority, structure, and long-term achievement. Management, government, and traditional institutions are your natural domain.","Vaša karijera je stvorena za autoritet, strukturu i dugoročno postignuće.","Deine Karriere ist für Autorität, Struktur und langfristigen Erfolg gemacht."],
  Aquarius:    ["Your career path is unconventional and future-oriented. Technology, social innovation, science, and humanitarian work call to your nature.","Vaš karijerni put je nekonvencionalan i usmeren ka budućnosti.","Dein Karriereweg ist unkonventionell und zukunftsorientiert."],
  Pisces:      ["Your career thrives in creative, healing, and spiritual domains. Arts, music, therapy, and compassion-driven work fulfill your calling.","Vaša karijera napreduje u kreativnim, isceliteljskim i duhovnim domenima.","Deine Karriere gedeiht in kreativen, heilenden und spirituellen Bereichen."],
};

const SATURN_SIGN = {
  Aries:       ["You must learn patience in career pursuits. Disciplined initiative brings lasting success.","Morate naučiti strpljenje u karijernim poduhvatima. Disciplinovana inicijativa donosi trajni uspeh.","Du musst Geduld in Karriereangelegenheiten lernen. Disziplinierte Initiative bringt dauerhaften Erfolg."],
  Taurus:      ["Financial security comes through slow, steady effort. Your greatest wealth builds through consistent hard work.","Finansijska sigurnost dolazi kroz spor, postojan napor.","Finanzielle Sicherheit kommt durch langsame, stetige Anstrengung."],
  Gemini:      ["Professional growth requires focused expertise rather than scattered interests. Mastering communication becomes your career asset.","Profesionalni rast zahteva fokusiranu stručnost, a ne rasute interese.","Berufliches Wachstum erfordert fokussierte Expertise statt verstreuter Interessen."],
  Cancer:      ["Work-life balance is your key challenge. Setting emotional boundaries at work leads to career maturity.","Ravnoteža između posla i života je vaš ključni izazov.","Work-Life-Balance ist deine zentrale Herausforderung."],
  Leo:         ["The lesson is earning recognition through substance, not just flair. True authority comes from serving others.","Lekcija je zaraditi priznanje kroz suštinu, ne samo šarm.","Die Lektion ist, Anerkennung durch Substanz zu verdienen, nicht nur durch Flair."],
  Virgo:       ["Perfectionism can paralyze your progress. Learning when good enough is truly good enough transforms your work ethic.","Perfekcionizam može paralisati vaš napredak.","Perfektionismus kann deinen Fortschritt lähmen."],
  Libra:       ["Decision-making in business is your growth edge. Making firm professional choices builds your career authority.","Donošenje odluka u poslu je vaš prostor za rast.","Entscheidungsfindung im Geschäft ist dein Wachstumsbereich."],
  Scorpio:     ["Power dynamics at work are your teacher. Learning to wield influence ethically transforms struggles into deep authority.","Dinamika moći na poslu je vaš učitelj.","Machtdynamiken bei der Arbeit sind dein Lehrer."],
  Sagittarius: ["Your challenge is committing to one path long enough to master it. Discipline applied to your broad vision creates extraordinary results.","Vaš izazov je da se posvetite jednom putu dovoljno dugo da ga savladate.","Deine Herausforderung ist, dich lange genug einem Weg zu widmen, um ihn zu meistern."],
  Capricorn:   ["You have a natural gift for professional endurance. The risk is overworking or defining yourself entirely through career — balance is key.","Imate prirodni dar za profesionalnu izdržljivost. Rizik je prekomerni rad.","Du hast ein natürliches Talent für berufliche Ausdauer. Das Risiko ist Überarbeitung."],
  Aquarius:    ["Working within systems while maintaining your innovative vision is the challenge. Your ideas need structure to become real achievements.","Rad unutar sistema uz održavanje vaše inovativne vizije je izazov.","Innerhalb von Systemen zu arbeiten und deine innovative Vision zu bewahren, ist die Herausforderung."],
  Pisces:      ["Grounding your dreams into practical work is your life lesson. Creative talents become professionally powerful when given structure.","Uzemljavanje vaših snova u praktičan rad je vaša životna lekcija.","Deine Träume in praktische Arbeit zu erden, ist deine Lebenslektion."],
};

const SECOND_HOUSE = {
  Aries:       ["You earn money through initiative and bold action. You're a natural self-starter financially but must guard against impulsive spending.","Zarađujete novac kroz inicijativu i hrabru akciju.","Du verdienst Geld durch Initiative und mutiges Handeln."],
  Taurus:      ["You have a natural talent for building wealth steadily. Material security is important, and you instinctively know how to grow resources.","Imate prirodni talenat za stabilnu izgradnju bogatstva.","Du hast ein natürliches Talent, Vermögen stetig aufzubauen."],
  Gemini:      ["Multiple income streams suit you well. Your earning power comes from communication skills and intellectual versatility.","Višestruki tokovi prihoda vam odgovaraju.","Mehrere Einkommensquellen passen gut zu dir."],
  Cancer:      ["Financial security is tied to emotional well-being. You earn well in nurturing fields and save for family security.","Finansijska sigurnost je vezana za emocionalno blagostanje.","Finanzielle Sicherheit ist mit emotionalem Wohlbefinden verbunden."],
  Leo:         ["You attract money through creativity, generosity, and personal charisma. You enjoy spending on quality and luxury.","Privlačite novac kroz kreativnost, velikodušnost i ličnu harizmu.","Du ziehst Geld durch Kreativität, Großzügigkeit und Charisma an."],
  Virgo:       ["You earn through meticulous skill and service. Budgeting comes naturally, though you may undervalue your own worth.","Zarađujete kroz pedantnu veštinu i službu.","Du verdienst durch sorgfältige Fähigkeiten und Dienst."],
  Libra:       ["You earn best in partnership or aesthetically-driven fields. Financial balance matters to you.","Najbolje zarađujete u partnerstvu ili estetski vođenim oblastima.","Du verdienst am besten in Partnerschaften oder ästhetisch orientierten Bereichen."],
  Scorpio:     ["You have powerful instincts about money and investments. Shared resources and strategic financial moves can be significant wealth sources.","Imate snažne instinkte za novac i investicije.","Du hast kräftige Instinkte für Geld und Investitionen."],
  Sagittarius: ["You attract abundance through optimism and big-picture thinking. International business can be particularly profitable.","Privlačite obilje kroz optimizam i razmišljanje o velikoj slici.","Du ziehst Überfluss durch Optimismus und Weitblick an."],
  Capricorn:   ["You build wealth through discipline, long-term planning, and steady career advancement. Your money habits are solid.","Gradite bogatstvo kroz disciplinu, dugoročno planiranje i stabilan napredak.","Du baust Vermögen durch Disziplin und langfristige Planung auf."],
  Aquarius:    ["Your income may come through unconventional or technology-driven sources. You value financial independence over wealth accumulation.","Vaš prihod može doći kroz nekonvencionalne ili tehnološki vođene izvore.","Dein Einkommen kann aus unkonventionellen Quellen stammen."],
  Pisces:      ["Money flows in intuitive, sometimes unpredictable ways. Creative and spiritual work can be surprisingly lucrative.","Novac teče na intuitivan, ponekad nepredvidiv način.","Geld fließt auf intuitive, manchmal unvorhersehbare Weise."],
};

const ASC_HEALTH = {
  Aries:       ["You have a strong, athletic constitution with high physical energy. Watch for head-related issues and inflammation. Regular physical activity is essential.","Imate snažnu, atletsku konstituciju sa visokom fizičkom energijom. Pazite na probleme vezane za glavu i upale.","Du hast eine starke, athletische Konstitution. Achte auf Kopfprobleme und Entzündungen."],
  Taurus:      ["Your constitution is robust and enduring. The throat, thyroid, and neck are sensitive areas. Maintaining a balanced diet is crucial.","Vaša konstitucija je robusna i izdržljiva. Grlo, štitna žlezda i vrat su osetljiva područja.","Deine Konstitution ist robust und ausdauernd. Hals und Schilddrüse sind empfindlich."],
  Gemini:      ["Your nervous system is your health barometer. Anxiety and respiratory issues signal you to slow down. Breathing exercises benefit you greatly.","Vaš nervni sistem je barometar vašeg zdravlja. Anksioznost i respiratorni problemi su signali da usporite.","Dein Nervensystem ist dein Gesundheitsbarometer."],
  Cancer:      ["Your health is closely linked to your emotional state. The stomach and digestion are sensitive areas. Emotional stress manifests physically.","Vaše zdravlje je usko povezano sa vašim emocionalnim stanjem. Stomak i varenje su osetljiva područja.","Deine Gesundheit ist eng mit deinem emotionalen Zustand verbunden."],
  Leo:         ["You have a vital, warm constitution with strong recuperative power. The heart and spine need attention. Joy and play are health necessities.","Imate vitalnu, toplu konstituciju sa snažnom moći oporavka. Srce i kičma zahtevaju pažnju.","Du hast eine vitale, warme Konstitution. Herz und Wirbelsäule brauchen Aufmerksamkeit."],
  Virgo:       ["You are health-conscious by nature, with a sensitive digestive system. Worry affects your body directly. A structured wellness routine keeps you at your best.","Po prirodi ste svesni zdravlja, sa osetljivim digestivnim sistemom.","Du bist von Natur aus gesundheitsbewusst, mit empfindlichem Verdauungssystem."],
  Libra:       ["Your health depends on balance in all things — diet, exercise, work, and rest. The kidneys and lower back are vulnerable areas.","Vaše zdravlje zavisi od ravnoteže u svemu — ishrani, vežbanju, poslu i odmoru.","Deine Gesundheit hängt von Balance in allen Dingen ab."],
  Scorpio:     ["You have powerful regenerative abilities but tend to push through illness. The reproductive system needs care. Emotional release is essential for physical health.","Imate snažne regenerativne sposobnosti, ali imate tendenciju da se probijate kroz bolest.","Du hast starke regenerative Fähigkeiten."],
  Sagittarius: ["You have a naturally optimistic and resilient constitution. The hips, thighs, and liver need attention. Outdoor activity is a genuine health requirement.","Imate prirodno optimističnu i otpornu konstituciju. Kukovi, butine i jetra zahtevaju pažnju.","Du hast eine natürlich optimistische und widerstandsfähige Konstitution."],
  Capricorn:   ["Your constitution strengthens with age. Bones, joints, and knees are areas to monitor. Discipline in health routines pays off dramatically over time.","Vaša konstitucija jača sa godinama. Kosti, zglobovi i kolena su područja za praćenje.","Deine Konstitution wird mit dem Alter stärker."],
  Aquarius:    ["Your health is connected to your nervous system and circulation. Stress from feeling constrained affects you physically. Freedom is a health requirement.","Vaše zdravlje je povezano sa nervnim sistemom i cirkulacijom.","Deine Gesundheit ist mit dem Nervensystem und Kreislauf verbunden."],
  Pisces:      ["Your health is deeply affected by your emotional and spiritual state. The feet and immune function are sensitive. Creative expression is a powerful healing tool.","Vaše zdravlje je duboko pogođeno vašim emocionalnim i duhovnim stanjem.","Deine Gesundheit wird tief von deinem emotionalen und spirituellen Zustand beeinflusst."],
};

const SUN_VITALITY = {
  Aries:       ["Your vitality is fueled by action and challenge. Competitive sports and physical challenges keep your energy peak.","Vaša vitalnost je pogonjana akcijom i izazovom.","Deine Vitalität wird von Aktion und Herausforderung gespeist."],
  Taurus:      ["Your energy is steady and enduring. Nature, good food, and sensory pleasure recharge you. Overindulgence is the main health risk.","Vaša energija je stabilna i trajna. Priroda i dobra hrana vas pune.","Deine Energie ist stetig und ausdauernd."],
  Gemini:      ["Your vitality depends on mental engagement. Boredom is genuinely harmful to your health. Walking and variety keep your energy balanced.","Vaša vitalnost zavisi od mentalne angažovanosti. Dosada je zaista štetna po zdravlje.","Deine Vitalität hängt von geistiger Beschäftigung ab."],
  Cancer:      ["Your energy fluctuates with your emotions. When emotionally nourished, you have deep reserves. Water activities are therapeutic.","Vaša energija fluktuira sa vašim emocijama.","Deine Energie schwankt mit deinen Emotionen."],
  Leo:         ["Your vitality is solar-powered. Sunlight, joy, and creative play recharge you. A lack of fun genuinely depletes your health.","Vaša vitalnost je solarna. Sunčeva svetlost, radost i kreativna igra vas pune.","Deine Vitalität ist sonnengespeist. Sonnenlicht und Freude laden dich auf."],
  Virgo:       ["Your energy thrives with routine and clean living. What you eat directly shapes your vitality. Mindfulness counteracts your tendency to worry.","Vaša energija napreduje sa rutinom i čistim životom.","Deine Energie gedeiht mit Routine und gesundem Leben."],
  Libra:       ["Your vitality depends on harmony in your environment. Conflict genuinely drains you. Beautiful spaces and balanced relationships restore your health.","Vaša vitalnost zavisi od harmonije u vašem okruženju.","Deine Vitalität hängt von Harmonie in deiner Umgebung ab."],
  Scorpio:     ["Your energy runs deep and intense. You can endure remarkable challenges but need periodic emotional purging. Transformation is your healing mechanism.","Vaša energija je duboka i intenzivna. Transformacija je vaš mehanizam isceljenja.","Deine Energie ist tief und intensiv. Transformation ist dein Heilungsmechanismus."],
  Sagittarius: ["Your vitality thrives on adventure, purpose, and movement. Travel and outdoor pursuits keep your fire burning bright.","Vaša vitalnost napreduje na avanturi, svrsi i pokretu.","Deine Vitalität gedeiht durch Abenteuer, Sinn und Bewegung."],
  Capricorn:   ["Your stamina is exceptional but you often ignore your body's signals. Regular preventive care and allowing yourself rest are essential.","Vaša izdržljivost je izuzetna, ali često ignorišete signale tela.","Deine Ausdauer ist außergewöhnlich, aber du ignorierst oft Körpersignale."],
  Aquarius:    ["Your energy is electric and unpredictable. Mental stimulation and social purpose fuel you. Grounding practices balance your high-frequency energy.","Vaša energija je električna i nepredvidiva.","Deine Energie ist elektrisch und unvorhersehbar."],
  Pisces:      ["Your energy is sensitive and absorbs your environment. You need regular solitude and spiritual practice to recharge. Water therapy is your best medicine.","Vaša energija je osetljiva i upija vaše okruženje.","Deine Energie ist sensitiv und absorbiert deine Umgebung."],
};

const SIXTH_HOUSE = {
  Aries:       ["You benefit from high-intensity workouts and competitive fitness routines.","Korist vam donose visokointenzivni treninzi i takmičarske fitnes rutine.","Du profitierst von hochintensivem Training."],
  Taurus:      ["Slow, consistent health routines work best. Yoga, walking in nature, and nutritious diet are your most effective wellness tools.","Spore, dosledne zdravstvene rutine najbolje funkcionišu.","Langsame, konsequente Gesundheitsroutinen funktionieren am besten."],
  Gemini:      ["Variety in your fitness routine prevents boredom and dropout. Activities that engage both mind and body suit you best.","Raznolikost u fitnes rutini sprečava dosadu i odustajanje.","Abwechslung in deiner Fitnessroutine verhindert Langeweile."],
  Cancer:      ["Home-based wellness routines and emotional self-care are key. Swimming and cooking healthy meals support your health best.","Wellness rutine kod kuće i emocionalna briga o sebi su ključni.","Häusliche Wellness-Routinen und emotionale Selbstfürsorge sind der Schlüssel."],
  Leo:         ["Fun and joy must be part of your health routine or you won't stick with it. Group fitness and dancing keep you motivated.","Zabava i radost moraju biti deo vaše zdravstvene rutine.","Spaß und Freude müssen Teil deiner Gesundheitsroutine sein."],
  Virgo:       ["You naturally gravitate toward clean eating and organized health regimens. Avoid health anxiety from overanalyzing.","Prirodno gravitirate ka čistoj ishrani i organizovanim zdravstvenim režimima.","Du neigst natürlich zu sauberer Ernährung und organisierten Gesundheitsprogrammen."],
  Libra:       ["Partner workouts and aesthetically pleasing fitness environments motivate you. Balance between activity and rest is your golden rule.","Treninzi sa partnerom i estetski prijatna fitnes okruženja vas motivišu.","Partner-Workouts und ästhetisch ansprechende Fitnessumgebungen motivieren dich."],
  Scorpio:     ["Intense, transformative fitness practices suit you — martial arts, power training, and deep-tissue bodywork.","Intenzivne, transformativne fitnes prakse vam odgovaraju — borilačke veštine, trening snage.","Intensive, transformative Fitnesspraktiken passen zu dir."],
  Sagittarius: ["Outdoor fitness, hiking, and adventurous physical activities are your best medicine. Monotonous gym routines kill your motivation.","Fitnes na otvorenom, planinarenje i avanturističke aktivnosti su vaš najbolji lek.","Outdoor-Fitness und Wandern sind deine beste Medizin."],
  Capricorn:   ["Structured, goal-oriented fitness plans work best. You excel with measurable targets and disciplined routines.","Strukturisani, ciljno orijentisani fitnes planovi najbolje funkcionišu.","Strukturierte, zielorientierte Fitnesspläne funktionieren am besten."],
  Aquarius:    ["Unconventional fitness approaches appeal to you — aerial yoga, community sports. Technology-assisted health tracking suits your nature.","Nekonvencionalni fitnes pristupi vam se dopadaju.","Unkonventionelle Fitness-Ansätze sprechen dich an."],
  Pisces:      ["Water-based exercise, gentle yoga, tai chi, and movement with music are your ideal health practices.","Vežbe u vodi, nežna joga, tai chi i pokret uz muziku su vaše idealne prakse.","Wasserbasierte Bewegung, sanftes Yoga und Tai Chi sind deine idealen Praktiken."],
};

const HEADERS = {
  love:   { venus: ["Your Love Style","Vaš Stil Ljubavi","Dein Liebesstil"], moon: ["Your Emotional Needs","Vaše Emocionalne Potrebe","Deine Emotionalen Bedürfnisse"], dsc: ["What You Attract in Partners","Šta Privlačite u Partnerima","Was du bei Partnern anziehst"] },
  work:   { mc: ["Your Career Direction","Vaš Karijerni Pravac","Deine Karriererichtung"], saturn: ["Your Work Challenges","Vaši Radni Izazovi","Deine Beruflichen Herausforderungen"], money: ["Your Money Approach","Vaš Odnos prema Novcu","Dein Umgang mit Geld"] },
  health: { asc: ["Your Constitution","Vaša Konstitucija","Deine Konstitution"], sun: ["Your Vitality Source","Vaš Izvor Vitalnosti","Deine Vitalitätsquelle"], habits: ["Your Health Habits","Vaše Zdravstvene Navike","Deine Gesundheitsgewohnheiten"] },
};

const TITLES = {
  love:   ["Love & Relationships","Ljubav i Odnosi","Liebe & Beziehungen"],
  work:   ["Work & Money","Posao i Novac","Arbeit & Geld"],
  health: ["Health & Vitality","Zdravlje i Vitalnost","Gesundheit & Vitalität"],
};

export function generateLifeReading(chart, lang = "en") {
  const idx = lang === "sr" ? 1 : lang === "de" ? 2 : 0;
  const venus = findPlanet(chart, "Venus");
  const moon  = findPlanet(chart, "Moon");
  const sun   = findPlanet(chart, "Sun");
  const saturn = findPlanet(chart, "Saturn");
  const dscSign = signAt(chart.houses.descendant);
  const mcSign  = signAt(chart.houses.midheaven);
  const ascSign = signAt(chart.houses.ascendant);
  const h2Sign  = signAt(chart.houses.cusps[1]);
  const h6Sign  = signAt(chart.houses.cusps[5]);

  const sec = (dict, key, heading) => ({ heading: heading[idx], planet: key, sign: dict === DSC_SIGN ? dscSign : "?", text: pick(dict, "?", lang) });

  return {
    love: {
      title: TITLES.love[idx],
      sections: [
        venus  && { heading: HEADERS.love.venus[idx], planet: "Venus",  sign: venus.sign,  text: pick(VENUS_SIGN, venus.sign, lang) },
        moon   && { heading: HEADERS.love.moon[idx],  planet: "Moon",   sign: moon.sign,   text: pick(MOON_LOVE, moon.sign, lang) },
        { heading: HEADERS.love.dsc[idx], planet: "DSC", sign: dscSign, text: pick(DSC_SIGN, dscSign, lang) },
      ].filter(Boolean),
    },
    work: {
      title: TITLES.work[idx],
      sections: [
        { heading: HEADERS.work.mc[idx], planet: "MC", sign: mcSign, text: pick(MC_SIGN, mcSign, lang) },
        saturn && { heading: HEADERS.work.saturn[idx], planet: "Saturn", sign: saturn.sign, text: pick(SATURN_SIGN, saturn.sign, lang) },
        { heading: HEADERS.work.money[idx], planet: "2nd House", sign: h2Sign, text: pick(SECOND_HOUSE, h2Sign, lang) },
      ].filter(Boolean),
    },
    health: {
      title: TITLES.health[idx],
      sections: [
        { heading: HEADERS.health.asc[idx], planet: "ASC", sign: ascSign, text: pick(ASC_HEALTH, ascSign, lang) },
        sun && { heading: HEADERS.health.sun[idx], planet: "Sun", sign: sun.sign, text: pick(SUN_VITALITY, sun.sign, lang) },
        { heading: HEADERS.health.habits[idx], planet: "6th House", sign: h6Sign, text: pick(SIXTH_HOUSE, h6Sign, lang) },
      ].filter(Boolean),
    },
  };
}
