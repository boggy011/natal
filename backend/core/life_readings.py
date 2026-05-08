"""Multilingual life-topic readings derived from natal chart placements.

Generates natural-language interpretations for Love, Work/Money, and Health
based on planetary positions, house cusps, and aspects.
"""

from __future__ import annotations

from typing import Any

from backend.core.models import NatalChart

SUPPORTED_LANGS = ("en", "sr", "de")
SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]


def _sign_at(longitude: float) -> str:
    return SIGNS[int(longitude / 30) % 12]


def _find_planet(chart: NatalChart, name: str) -> Any | None:
    for p in chart.planets:
        if p.name == name:
            return p
    return None


def _pick(d: dict[str, tuple[str, str, str]], key: str, lang: str) -> str:
    idx = SUPPORTED_LANGS.index(lang) if lang in SUPPORTED_LANGS else 0
    if key in d:
        return d[key][idx]
    return ""


# ── LOVE: Venus in sign ─────────────────────────────────────────────────
_VENUS_SIGN: dict[str, tuple[str, str, str]] = {
    "Aries": (
        "You love with fire and intensity. Passion ignites fast, and you need excitement, spontaneity, and a partner who can match your bold energy.",
        "Volite vatreno i intenzivno. Strast se brzo pali, a potrebno vam je uzbuđenje, spontanost i partner koji može da prati vašu hrabru energiju.",
        "Du liebst mit Feuer und Intensitat. Leidenschaft entflammt schnell, und du brauchst Aufregung, Spontaneitat und einen Partner, der deiner mutigen Energie gewachsen ist.",
    ),
    "Taurus": (
        "You love deeply and steadily. Physical affection, loyalty, and comfort matter most. You build lasting bonds through patience and sensual devotion.",
        "Volite duboko i postojano. Fizicka nežnost, lojalnost i udobnost su vam najvažniji. Gradite trajne veze kroz strpljenje i čulnu posvećenost.",
        "Du liebst tief und bestandig. Korperliche Zuneigung, Treue und Geborgenheit sind dir am wichtigsten. Du baust dauerhafte Bindungen durch Geduld und sinnliche Hingabe auf.",
    ),
    "Gemini": (
        "You love through words, wit, and intellectual connection. Variety keeps your heart alive. A partner who stimulates your mind wins your affection.",
        "Volite kroz reči, duhovitost i intelektualnu povezanost. Raznolikost održava vaše srce živim. Partner koji stimuliše vaš um osvaja vaše srce.",
        "Du liebst durch Worte, Witz und geistige Verbindung. Abwechslung halt dein Herz lebendig. Ein Partner, der deinen Geist anregt, gewinnt deine Zuneigung.",
    ),
    "Cancer": (
        "You love with nurturing depth and emotional devotion. Security and a sense of home in your partner are essential. Your love is protective and enduring.",
        "Volite sa brižnom dubinom i emocionalnom posvećenošću. Sigurnost i osećaj doma u partneru su vam neophodni. Vaša ljubav je zaštitnicka i trajna.",
        "Du liebst mit fursorglicher Tiefe und emotionaler Hingabe. Sicherheit und ein Gefuhl von Zuhause beim Partner sind dir wesentlich. Deine Liebe ist beschutzend und bestandig.",
    ),
    "Leo": (
        "You love grandly and generously. Romance, admiration, and creative expression fuel your heart. You need a partner who celebrates you as you celebrate them.",
        "Volite velikodušno i veličanstveno. Romantika, divljenje i kreativno izražavanje hrane vaše srce. Potreban vam je partner koji vas slavi kao što vi slavite njega.",
        "Du liebst grosszugig und grandios. Romantik, Bewunderung und kreativer Ausdruck nahren dein Herz. Du brauchst einen Partner, der dich feiert, wie du ihn feierst.",
    ),
    "Virgo": (
        "You love through acts of service and quiet devotion. You notice the small things and show care through practical support. Reliability is your love language.",
        "Volite kroz dela služenja i tihu posvećenost. Primećujete male stvari i pokazujete brigu kroz praktičnu podršku. Pouzdanost je vaš jezik ljubavi.",
        "Du liebst durch Taten der Fursorge und stille Hingabe. Du bemerkst die kleinen Dinge und zeigst Zuneigung durch praktische Unterstutzung. Zuverlassigkeit ist deine Liebessprache.",
    ),
    "Libra": (
        "You love with grace, harmony, and a deep desire for partnership. Beauty and balance in relationships are essential. You thrive when love feels like a true equal exchange.",
        "Volite sa gracioznošću, harmonijom i dubokom željom za partnerstvom. Lepota i ravnoteža u odnosima su vam neophodni. Napredujete kada ljubav deluje kao istinska razmena.",
        "Du liebst mit Anmut, Harmonie und einem tiefen Wunsch nach Partnerschaft. Schonheit und Gleichgewicht in Beziehungen sind dir wesentlich. Du bluhst auf, wenn Liebe sich wie ein echter Austausch anfuhlt.",
    ),
    "Scorpio": (
        "You love with transformative intensity. Emotional depth, trust, and soul-level bonding are non-negotiable. Superficial connections leave you cold — you crave all or nothing.",
        "Volite sa transformativnom snagom. Emocionalna dubina, poverenje i povezivanje na nivou duše su nepokolebljivi. Površne veze vas ostavljaju hladnim — želite sve ili ništa.",
        "Du liebst mit transformativer Intensitat. Emotionale Tiefe, Vertrauen und Seelenbindung sind unverzichtbar. Oberflachliche Verbindungen lassen dich kalt — du sehnst dich nach Alles oder Nichts.",
    ),
    "Sagittarius": (
        "You love with optimism, adventure, and philosophical openness. Freedom within partnership is vital. A shared love for exploration and growth keeps your flame alive.",
        "Volite sa optimizmom, avanturom i filozofskom otvorenošću. Sloboda unutar partnerstva je vitalna. Zajednička ljubav prema istraživanju i rastu održava vaš plamen.",
        "Du liebst mit Optimismus, Abenteuerlust und philosophischer Offenheit. Freiheit innerhalb der Partnerschaft ist lebenswichtig. Eine gemeinsame Liebe fur Entdeckung und Wachstum halt deine Flamme am Leben.",
    ),
    "Capricorn": (
        "You love with commitment, ambition, and quiet strength. You take relationships seriously and build love like you build everything — with endurance and long-term vision.",
        "Volite sa posvećenošću, ambicijom i tihom snagom. Ozbiljno shvatate veze i gradite ljubav kao što gradite sve — sa istrajnošću i dugoročnom vizijom.",
        "Du liebst mit Hingabe, Ehrgeiz und stiller Starke. Du nimmst Beziehungen ernst und baust Liebe auf, wie du alles aufbaust — mit Ausdauer und langfristiger Vision.",
    ),
    "Aquarius": (
        "You love with originality and intellectual freedom. Friendship is the foundation of your romantic bonds. You need space to be yourself and a partner who respects your individuality.",
        "Volite sa originalnošću i intelektualnom slobodom. Prijateljstvo je temelj vaših romantičnih veza. Potreban vam je prostor da budete svoji i partner koji poštuje vašu individualnost.",
        "Du liebst mit Originalitat und geistiger Freiheit. Freundschaft ist das Fundament deiner romantischen Bindungen. Du brauchst Raum, du selbst zu sein, und einen Partner, der deine Individualitat respektiert.",
    ),
    "Pisces": (
        "You love with boundless compassion, imagination, and spiritual sensitivity. You merge deeply with your partner and seek a love that transcends the ordinary.",
        "Volite sa beskrajnim saosećanjem, maštom i duhovnom osetljivošću. Duboko se spajate sa partnerom i tražite ljubav koja prevazilazi obično.",
        "Du liebst mit grenzenlosem Mitgefuhl, Fantasie und spiritueller Sensibilitat. Du verschmilzt tief mit deinem Partner und suchst eine Liebe, die das Gewohnliche ubersteigt.",
    ),
}

# ── LOVE: Moon sign (emotional needs) ───────────────────────────────────
_MOON_LOVE: dict[str, tuple[str, str, str]] = {
    "Aries": (
        "Emotionally, you need directness and independence. You process feelings quickly and want a partner who doesn't shy away from honest confrontation.",
        "Emocionalno, potrebna vam je direktnost i nezavisnost. Brzo obrađujete osećanja i želite partnera koji se ne plaši iskrenog suočavanja.",
        "Emotional brauchst du Direktheit und Unabhangigkeit. Du verarbeitest Gefuhle schnell und wunschst dir einen Partner, der ehrlicher Konfrontation nicht ausweicht.",
    ),
    "Taurus": (
        "Your emotional world craves stability and physical comfort. Touch, routine, and a serene home environment make you feel loved and secure.",
        "Vaš emocionalni svet čezne za stabilnošću i fizičkom udobnošću. Dodir, rutina i mirno kućno okruženje čine da se osećate voljeno i sigurno.",
        "Deine emotionale Welt sehnt sich nach Stabilitat und korperlichem Wohlbehagen. Beruhrung, Routine und eine ruhige Umgebung geben dir Liebe und Sicherheit.",
    ),
    "Gemini": (
        "You need constant mental stimulation to feel emotionally connected. Talking, sharing ideas, and humor are your primary emotional outlets.",
        "Potrebna vam je stalna mentalna stimulacija da biste se osećali emocionalno povezano. Razgovor, deljenje ideja i humor su vaši primarni emocionalni ventili.",
        "Du brauchst standige geistige Anregung, um dich emotional verbunden zu fuhlen. Gesprache, Ideenaustausch und Humor sind deine wichtigsten emotionalen Ventile.",
    ),
    "Cancer": (
        "Your emotional needs are deep and protective. You need to feel safe before opening up, and you nurture your loved ones with fierce devotion.",
        "Vaše emocionalne potrebe su duboke i zaštitničke. Morate se osećati bezbedno pre nego što se otvorite, a brinete o voljenima sa žestokom posvećenošću.",
        "Deine emotionalen Bedurfnisse sind tief und beschutzend. Du musst dich sicher fuhlen, bevor du dich offnest, und du umsorgest deine Liebsten mit leidenschaftlicher Hingabe.",
    ),
    "Leo": (
        "You need to feel admired and emotionally appreciated. Your heart opens wide when your partner celebrates your uniqueness and showers you with warmth.",
        "Morate se osećati obožavano i emocionalno cenjeno. Vaše srce se široko otvara kada partner slavi vašu jedinstvenost i obasipa vas toplinom.",
        "Du musst dich bewundert und emotional geschatzt fuhlen. Dein Herz offnet sich weit, wenn dein Partner deine Einzigartigkeit feiert und dich mit Warme uberschuttet.",
    ),
    "Virgo": (
        "You show love through practical care and feel loved when others notice your efforts. Emotional order and a sense of being useful ground your heart.",
        "Ljubav pokazujete kroz praktičnu brigu i osećate se voljeno kada drugi primete vaše napore. Emocionalni red i osećaj korisnosti uzemljuju vaše srce.",
        "Du zeigst Liebe durch praktische Fursorge und fuhlst dich geliebt, wenn andere deine Bemuhungen bemerken. Emotionale Ordnung und das Gefuhl, nutzlich zu sein, erden dein Herz.",
    ),
    "Libra": (
        "You feel emotionally fulfilled through harmony and partnership. Conflict drains you; beauty and grace in your emotional environment restore you.",
        "Osećate se emocionalno ispunjeno kroz harmoniju i partnerstvo. Konflikti vas iscrpljuju; lepota i gracioznost u vašem emocionalnom okruženju vas obnavljaju.",
        "Du fuhlst dich emotional erfullt durch Harmonie und Partnerschaft. Konflikte erschopfen dich; Schonheit und Anmut in deiner emotionalen Umgebung stellen dich wieder her.",
    ),
    "Scorpio": (
        "Your emotional life runs deep and intense. You need absolute trust and emotional honesty. Half-hearted connections feel unbearable to your sensitive soul.",
        "Vaš emocionalni život je dubok i intenzivan. Potrebno vam je apsolutno poverenje i emocionalna iskrenost. Polovične veze su nepodnošljive za vašu osetljivu dušu.",
        "Dein emotionales Leben ist tief und intensiv. Du brauchst absolutes Vertrauen und emotionale Ehrlichkeit. Halbherzige Verbindungen sind fur deine sensible Seele unertraglich.",
    ),
    "Sagittarius": (
        "You need emotional freedom and adventure. Feeling trapped kills your spirit. You're happiest when love is combined with exploration and shared meaning.",
        "Potrebna vam je emocionalna sloboda i avantura. Osećaj zarobljenosti ubija vaš duh. Najsrećniji ste kada je ljubav spojena sa istraživanjem i zajedničkim smislom.",
        "Du brauchst emotionale Freiheit und Abenteuer. Sich gefangen zu fuhlen totet deinen Geist. Du bist am glucklichsten, wenn Liebe mit Entdeckung und gemeinsamer Bedeutung verbunden ist.",
    ),
    "Capricorn": (
        "You guard your emotions carefully and need a partner who proves their reliability over time. Your love deepens slowly but becomes unshakable once rooted.",
        "Pažljivo čuvate svoja osećanja i potreban vam je partner koji dokazuje svoju pouzdanost vremenom. Vaša ljubav se polako produbljuje, ali postaje nepokolebljiva kada se ukoreni.",
        "Du hutest deine Emotionen sorgfaltig und brauchst einen Partner, der seine Zuverlassigkeit im Laufe der Zeit beweist. Deine Liebe vertieft sich langsam, wird aber unerschutterlich.",
    ),
    "Aquarius": (
        "You need emotional space and intellectual rapport. You love deeply but unconventionally, and need a partner who doesn't try to possess or define you.",
        "Potreban vam je emocionalni prostor i intelektualni sklad. Volite duboko, ali nekonvencionalno, i potreban vam je partner koji ne pokušava da vas poseduje ili definiše.",
        "Du brauchst emotionalen Freiraum und intellektuellen Gleichklang. Du liebst tief, aber unkonventionell, und brauchst einen Partner, der dich nicht besitzen oder definieren will.",
    ),
    "Pisces": (
        "Your emotional world is vast, intuitive, and deeply empathic. You absorb your partner's feelings and need love that feels like a spiritual sanctuary.",
        "Vaš emocionalni svet je ogroman, intuitivan i duboko empatičan. Upijate osećanja partnera i potrebna vam je ljubav koja se oseća kao duhovno utočište.",
        "Deine emotionale Welt ist weit, intuitiv und zutiefst empathisch. Du absorbierst die Gefuhle deines Partners und brauchst Liebe, die sich wie ein spirituelles Refugium anfuhlt.",
    ),
}

# ── LOVE: Descendant sign (partnerships) ────────────────────────────────
_DSC_SIGN: dict[str, tuple[str, str, str]] = {
    "Aries": (
        "You are attracted to bold, assertive partners who push you out of your comfort zone and ignite your competitive spirit.",
        "Privlače vas hrabri, asertivni partneri koji vas izbacuju iz zone komfora i pale vaš takmičarski duh.",
        "Du fuhlst dich zu mutigen, durchsetzungsstarken Partnern hingezogen, die dich aus deiner Komfortzone holen und deinen Kampfgeist entfachen.",
    ),
    "Taurus": (
        "You seek a grounded, reliable partner who brings stability and sensual pleasure into your life. Loyalty is your deepest requirement.",
        "Tražite uzemljenog, pouzdanog partnera koji donosi stabilnost i čulno zadovoljstvo u vaš život. Lojalnost je vaš najdublji zahtev.",
        "Du suchst einen geerdeten, verlasslichen Partner, der Stabilitat und sinnliches Vergnugen in dein Leben bringt. Treue ist dein tiefstes Bedurfnis.",
    ),
    "Gemini": (
        "You are drawn to witty, communicative partners who keep life intellectually stimulating and never boring.",
        "Privlače vas duhoviti, komunikativni partneri koji život čine intelektualno stimulativnim i nikada dosadnim.",
        "Du fuhlst dich zu witzigen, kommunikativen Partnern hingezogen, die das Leben intellektuell anregend und nie langweilig gestalten.",
    ),
    "Cancer": (
        "You seek emotionally attuned, nurturing partners who create a feeling of home wherever they are.",
        "Tražite emocionalno usklađene, brižne partnere koji stvaraju osećaj doma gde god da su.",
        "Du suchst emotional eingestimmte, fursorgende Partner, die ein Gefuhl von Zuhause schaffen, wo immer sie sind.",
    ),
    "Leo": (
        "You are attracted to confident, warm-hearted partners who bring drama, creativity, and passionate expression into your life.",
        "Privlače vas samouvereni, topli partneri koji donose dramu, kreativnost i strastveni izraz u vaš život.",
        "Du fuhlst dich zu selbstbewussten, warmherzigen Partnern hingezogen, die Drama, Kreativitat und leidenschaftlichen Ausdruck in dein Leben bringen.",
    ),
    "Virgo": (
        "You seek thoughtful, detail-oriented partners who show love through practical care and genuine helpfulness.",
        "Tražite pažljive, detaljno orijentisane partnere koji pokazuju ljubav kroz praktičnu brigu i istinsku pomoć.",
        "Du suchst nachdenkliche, detailorientierte Partner, die Liebe durch praktische Fursorge und echte Hilfsbereitschaft zeigen.",
    ),
    "Libra": (
        "You are drawn to graceful, diplomatic partners who value fairness and create beauty and balance in your shared life.",
        "Privlače vas graciozni, diplomatski partneri koji cene pravičnost i stvaraju lepotu i ravnotežu u vašem zajedničkom životu.",
        "Du fuhlst dich zu anmutigen, diplomatischen Partnern hingezogen, die Fairness schatzen und Schonheit und Gleichgewicht in eurem gemeinsamen Leben schaffen.",
    ),
    "Scorpio": (
        "You seek intense, transformative partners who are unafraid of emotional depth and can match your need for authenticity.",
        "Tražite intenzivne, transformativne partnere koji se ne plaše emocionalne dubine i mogu da odgovore vašoj potrebi za autentičnošću.",
        "Du suchst intensive, transformative Partner, die keine Angst vor emotionaler Tiefe haben und deinem Bedurfnis nach Authentizitat entsprechen.",
    ),
    "Sagittarius": (
        "You are attracted to adventurous, philosophical partners who expand your horizons and share your love of freedom and meaning.",
        "Privlače vas avanturistički, filozofski partneri koji šire vaše horizonte i dele vašu ljubav prema slobodi i smislu.",
        "Du fuhlst dich zu abenteuerlustigen, philosophischen Partnern hingezogen, die deinen Horizont erweitern und deine Liebe zu Freiheit und Sinn teilen.",
    ),
    "Capricorn": (
        "You seek ambitious, mature partners who take life seriously and can build something lasting together with you.",
        "Tražite ambiciozne, zrele partnere koji ozbiljno shvataju život i mogu da izgrade nešto trajno zajedno sa vama.",
        "Du suchst ehrgeizige, reife Partner, die das Leben ernst nehmen und gemeinsam mit dir etwas Dauerhaftes aufbauen konnen.",
    ),
    "Aquarius": (
        "You are drawn to unconventional, intellectually independent partners who value your freedom as much as their own.",
        "Privlače vas nekonvencionalni, intelektualno nezavisni partneri koji cene vašu slobodu koliko i svoju.",
        "Du fuhlst dich zu unkonventionellen, geistig unabhangigen Partnern hingezogen, die deine Freiheit ebenso schatzen wie ihre eigene.",
    ),
    "Pisces": (
        "You seek compassionate, intuitive partners who bring emotional depth, creativity, and a touch of magic into your life.",
        "Tražite saosećajne, intuitivne partnere koji donose emocionalnu dubinu, kreativnost i dodir magije u vaš život.",
        "Du suchst mitfuhlende, intuitive Partner, die emotionale Tiefe, Kreativitat und einen Hauch von Magie in dein Leben bringen.",
    ),
}

# ── WORK: MC sign (career direction) ────────────────────────────────────
_MC_SIGN: dict[str, tuple[str, str, str]] = {
    "Aries": (
        "Your career path favors leadership, entrepreneurship, and pioneering roles. You thrive when you can act independently and make bold decisions.",
        "Vaš karijerni put favorizuje liderstvo, preduzetništvo i pionirske uloge. Napredujete kada možete da delujete nezavisno i donosite hrabre odluke.",
        "Dein Karriereweg begunstigt Fuhrung, Unternehmertum und Pionierrollen. Du bluhst auf, wenn du unabhangig handeln und mutige Entscheidungen treffen kannst.",
    ),
    "Taurus": (
        "Your career is built through patience, persistence, and a talent for creating tangible value. Financial security is a core professional motivation.",
        "Vaša karijera se gradi kroz strpljenje, upornost i talenat za stvaranje opipljive vrednosti. Finansijska sigurnost je vaša osnovna profesionalna motivacija.",
        "Deine Karriere baut sich durch Geduld, Beharrlichkeit und ein Talent fur die Schaffung greifbarer Werte auf. Finanzielle Sicherheit ist deine zentrale berufliche Motivation.",
    ),
    "Gemini": (
        "Your professional life thrives on communication, versatility, and intellectual engagement. Writing, teaching, media, and connecting people suit you well.",
        "Vaš profesionalni život napreduje kroz komunikaciju, svestranost i intelektualni angažman. Pisanje, podučavanje, mediji i povezivanje ljudi vam dobro leže.",
        "Dein Berufsleben blüht durch Kommunikation, Vielseitigkeit und geistiges Engagement. Schreiben, Lehren, Medien und das Verbinden von Menschen liegen dir gut.",
    ),
    "Cancer": (
        "Your career is driven by nurturing, protection, and creating emotional security for others. Real estate, healthcare, food, and family-oriented businesses appeal to you.",
        "Vaša karijera je vođena brigom, zaštitom i stvaranjem emocionalne sigurnosti za druge. Nekretnine, zdravstvo, hrana i porodično orijentisani poslovi vas privlače.",
        "Deine Karriere wird von Fursorge, Schutz und der Schaffung emotionaler Sicherheit fur andere angetrieben. Immobilien, Gesundheitswesen, Gastronomie und familienorientierte Geschafte sprechen dich an.",
    ),
    "Leo": (
        "Your career shines in creative, performative, and leadership roles. You need recognition and a platform to express your unique vision and charisma.",
        "Vaša karijera blista u kreativnim, performativnim i liderskim ulogama. Potrebno vam je priznanje i platforma za izražavanje vaše jedinstvene vizije i harizme.",
        "Deine Karriere glänzt in kreativen, darstellerischen und Fuhrungsrollen. Du brauchst Anerkennung und eine Buhne, um deine einzigartige Vision und dein Charisma auszudrucken.",
    ),
    "Virgo": (
        "Your career excels through precision, analysis, and service to others. Healthcare, science, editing, and quality-focused work bring you professional fulfillment.",
        "Vaša karijera se ističe kroz preciznost, analizu i služenje drugima. Zdravstvo, nauka, uređivanje i rad fokusiran na kvalitet donose vam profesionalno ispunjenje.",
        "Deine Karriere zeichnet sich durch Prazision, Analyse und Dienst an anderen aus. Gesundheitswesen, Wissenschaft, Lektorat und qualitätsorientierte Arbeit bringen dir berufliche Erfullung.",
    ),
    "Libra": (
        "Your career thrives in partnerships, diplomacy, and aesthetics. Law, design, counseling, and any field requiring fairness and beauty suit your professional nature.",
        "Vaša karijera napreduje u partnerstvima, diplomatiji i estetici. Pravo, dizajn, savetovanje i svako polje koje zahteva pravičnost i lepotu odgovara vašoj profesionalnoj prirodi.",
        "Deine Karriere gedeiht in Partnerschaften, Diplomatie und Asthetik. Recht, Design, Beratung und jedes Feld, das Fairness und Schonheit erfordert, entspricht deiner beruflichen Natur.",
    ),
    "Scorpio": (
        "Your career is powered by intensity, research, and transformation. Psychology, finance, investigation, and roles involving power and depth attract you.",
        "Vaša karijera je pogonjana intenzitetom, istraživanjem i transformacijom. Psihologija, finansije, istrage i uloge koje uključuju moć i dubinu vas privlače.",
        "Deine Karriere wird von Intensitat, Forschung und Transformation angetrieben. Psychologie, Finanzen, Ermittlung und Rollen mit Macht und Tiefe ziehen dich an.",
    ),
    "Sagittarius": (
        "Your career needs meaning, expansion, and freedom. Education, travel, publishing, philosophy, and international work align with your professional spirit.",
        "Vaša karijera treba smisao, ekspanziju i slobodu. Obrazovanje, putovanja, izdavaštvo, filozofija i međunarodni rad se poklapaju sa vašim profesionalnim duhom.",
        "Deine Karriere braucht Sinn, Expansion und Freiheit. Bildung, Reisen, Verlagswesen, Philosophie und internationale Arbeit stimmen mit deinem beruflichen Geist uberein.",
    ),
    "Capricorn": (
        "Your career is built for authority, structure, and long-term achievement. Management, government, engineering, and traditional institutions are your natural domain.",
        "Vaša karijera je stvorena za autoritet, strukturu i dugoročno postignuće. Menadžment, vlada, inženjerstvo i tradicionalne institucije su vaš prirodni domen.",
        "Deine Karriere ist fur Autoritat, Struktur und langfristigen Erfolg gemacht. Management, Regierung, Ingenieurwesen und traditionelle Institutionen sind dein naturliches Gebiet.",
    ),
    "Aquarius": (
        "Your career path is unconventional and future-oriented. Technology, social innovation, science, and humanitarian work call to your visionary nature.",
        "Vaš karijerni put je nekonvencionalan i usmeren ka budućnosti. Tehnologija, društvene inovacije, nauka i humanitarni rad pozivaju vašu vizionarsku prirodu.",
        "Dein Karriereweg ist unkonventionell und zukunftsorientiert. Technologie, soziale Innovation, Wissenschaft und humanitare Arbeit sprechen deine visionare Natur an.",
    ),
    "Pisces": (
        "Your career thrives in creative, healing, and spiritual domains. Arts, music, therapy, spirituality, and compassion-driven work fulfill your professional calling.",
        "Vaša karijera napreduje u kreativnim, isceliteljskim i duhovnim domenima. Umetnost, muzika, terapija, duhovnost i rad vođen saosećanjem ispunjavaju vaš profesionalni poziv.",
        "Deine Karriere gedeiht in kreativen, heilenden und spirituellen Bereichen. Kunst, Musik, Therapie, Spiritualitat und mitfuhlende Arbeit erfullen deine berufliche Berufung.",
    ),
}

# ── WORK: Saturn sign (work ethic & challenges) ─────────────────────────
_SATURN_SIGN: dict[str, tuple[str, str, str]] = {
    "Aries": (
        "You must learn patience in career pursuits. Impulsive professional moves bring setbacks; disciplined initiative brings lasting success.",
        "Morate naučiti strpljenje u karijernim poduhvatima. Impulzivni profesionalni potezi donose neuspehe; disciplinovana inicijativa donosi trajni uspeh.",
        "Du musst Geduld in Karriereangelegenheiten lernen. Impulsive berufliche Schritte bringen Ruckschlage; disziplinierte Initiative bringt dauerhaften Erfolg.",
    ),
    "Taurus": (
        "Financial security comes through slow, steady effort. Resist shortcuts with money — your greatest wealth builds through consistent hard work.",
        "Finansijska sigurnost dolazi kroz spor, postojan napor. Oduprite se prečicama sa novcem — vaše najveće bogatstvo se gradi kroz dosledan naporan rad.",
        "Finanzielle Sicherheit kommt durch langsame, stetige Anstrengung. Widerstehe Abkurzungen beim Geld — dein grosster Reichtum entsteht durch konsequente harte Arbeit.",
    ),
    "Gemini": (
        "Professional growth requires focused expertise rather than scattered interests. Mastering communication skills becomes your greatest career asset.",
        "Profesionalni rast zahteva fokusiranu stručnost, a ne rasute interese. Savladavanje komunikacijskih veština postaje vaš najveći karijerni adut.",
        "Berufliches Wachstum erfordert fokussierte Expertise statt verstreuter Interessen. Die Meisterung von Kommunikationsfahigkeiten wird dein grosstes Karrierekapital.",
    ),
    "Cancer": (
        "Work-life balance is your key challenge. Setting emotional boundaries at work and building professional resilience lead to career maturity.",
        "Ravnoteža između posla i života je vaš ključni izazov. Postavljanje emocionalnih granica na poslu i izgradnja profesionalne otpornosti vode ka karijernoj zrelosti.",
        "Work-Life-Balance ist deine zentrale Herausforderung. Emotionale Grenzen bei der Arbeit zu setzen und berufliche Widerstandsfahigkeit aufzubauen fuhren zu Karrierereife.",
    ),
    "Leo": (
        "The lesson is earning recognition through substance, not just flair. True professional authority comes from serving others, not seeking applause.",
        "Lekcija je zaraditi priznanje kroz suštinu, ne samo šarm. Pravi profesionalni autoritet dolazi iz služenja drugima, ne iz traženja aplauza.",
        "Die Lektion ist, Anerkennung durch Substanz zu verdienen, nicht nur durch Flair. Wahre berufliche Autoritat kommt vom Dienen, nicht vom Suchen nach Beifall.",
    ),
    "Virgo": (
        "Perfectionism can paralyze your progress. Learning when good enough is truly good enough transforms your work ethic from anxious to masterful.",
        "Perfekcionizam može paralisati vaš napredak. Učenje kada je dovoljno dobro zaista dovoljno dobro transformiše vašu radnu etiku iz anksiozne u majstorsku.",
        "Perfektionismus kann deinen Fortschritt lahmen. Zu lernen, wann gut genug wirklich gut genug ist, verwandelt deine Arbeitsethik von angstlich in meisterhaft.",
    ),
    "Libra": (
        "Decision-making in business is your growth edge. Moving past people-pleasing and making firm professional choices builds your career authority.",
        "Donošenje odluka u poslu je vaš prostor za rast. Prevazilaženje ugađanja drugima i donošenje čvrstih profesionalnih izbora gradi vaš karijerni autoritet.",
        "Entscheidungsfindung im Geschaft ist dein Wachstumsbereich. Uber People-Pleasing hinauszugehen und feste berufliche Entscheidungen zu treffen, baut deine Karriereautoritat auf.",
    ),
    "Scorpio": (
        "Power dynamics at work are your teacher. Learning to wield influence ethically and release control transforms professional struggles into deep authority.",
        "Dinamika moći na poslu je vaš učitelj. Učenje da etički koristite uticaj i pustite kontrolu transformiše profesionalne borbe u duboki autoritet.",
        "Machtdynamiken bei der Arbeit sind dein Lehrer. Einfluss ethisch auszuuben und Kontrolle loszulassen, verwandelt berufliche Kampfe in tiefe Autoritat.",
    ),
    "Sagittarius": (
        "Your challenge is committing to one path long enough to master it. Discipline applied to your broad vision creates extraordinary professional results.",
        "Vaš izazov je da se posvetite jednom putu dovoljno dugo da ga savladate. Disciplina primenjena na vašu široku viziju stvara izvanredne profesionalne rezultate.",
        "Deine Herausforderung ist, dich lange genug einem Weg zu widmen, um ihn zu meistern. Disziplin, angewandt auf deine breite Vision, schafft aussergewohnliche berufliche Ergebnisse.",
    ),
    "Capricorn": (
        "You have a natural gift for professional endurance. The risk is overworking or defining yourself entirely through career achievement — balance is key.",
        "Imate prirodni dar za profesionalnu izdržljivost. Rizik je prekomerni rad ili definisanje sebe isključivo kroz karijerna postignuća — ravnoteža je ključna.",
        "Du hast ein naturliches Talent fur berufliche Ausdauer. Das Risiko ist Uberarbeitung oder dich ausschliesslich uber Karriereerfolge zu definieren — Balance ist der Schlussel.",
    ),
    "Aquarius": (
        "Working within systems while maintaining your innovative vision is the challenge. Your unconventional ideas need structure to become real-world achievements.",
        "Rad unutar sistema uz održavanje vaše inovativne vizije je izazov. Vaše nekonvencionalne ideje trebaju strukturu da bi postale realna postignuća.",
        "Innerhalb von Systemen zu arbeiten und gleichzeitig deine innovative Vision zu bewahren, ist die Herausforderung. Deine unkonventionellen Ideen brauchen Struktur, um reale Erfolge zu werden.",
    ),
    "Pisces": (
        "Grounding your dreams into practical work is your life lesson. Creative and spiritual talents become professionally powerful when given structure and discipline.",
        "Uzemljavanje vaših snova u praktičan rad je vaša životna lekcija. Kreativni i duhovni talenti postaju profesionalno moćni kada im se da struktura i disciplina.",
        "Deine Traume in praktische Arbeit zu erden, ist deine Lebenslektion. Kreative und spirituelle Talente werden beruflich machtig, wenn man ihnen Struktur und Disziplin gibt.",
    ),
}

# ── WORK: 2nd house sign (money approach) ───────────────────────────────
_SECOND_HOUSE: dict[str, tuple[str, str, str]] = {
    "Aries": (
        "You earn money through initiative and bold action. You're a natural self-starter financially but must guard against impulsive spending.",
        "Zarađujete novac kroz inicijativu i hrabru akciju. Prirodno ste samostalni finansijski, ali morate se čuvati od impulzivne potrošnje.",
        "Du verdienst Geld durch Initiative und mutiges Handeln. Du bist finanziell ein naturlicher Selbststarter, musst dich aber vor impulsivem Ausgeben huten.",
    ),
    "Taurus": (
        "You have a natural talent for building wealth steadily. Material security is important, and you instinctively know how to grow resources over time.",
        "Imate prirodni talenat za stabilnu izgradnju bogatstva. Materijalna sigurnost je važna, i instinktivno znate kako da uvećate resurse tokom vremena.",
        "Du hast ein naturliches Talent, Vermogen stetig aufzubauen. Materielle Sicherheit ist dir wichtig, und du weisst instinktiv, wie man Ressourcen uber die Zeit vermehrt.",
    ),
    "Gemini": (
        "Multiple income streams suit you well. Your earning power comes from communication skills, adaptability, and intellectual versatility.",
        "Višestruki tokovi prihoda vam odgovaraju. Vaša zaradna moć dolazi od komunikacijskih veština, prilagodljivosti i intelektualne svestranosti.",
        "Mehrere Einkommensquellen passen gut zu dir. Deine Verdienstmoglichkeiten kommen von Kommunikationsfahigkeiten, Anpassungsfahigkeit und geistiger Vielseitigkeit.",
    ),
    "Cancer": (
        "Financial security is tied to emotional well-being. You earn well in nurturing fields and tend to save for family security above all.",
        "Finansijska sigurnost je vezana za emocionalno blagostanje. Dobro zarađujete u brižnim oblastima i težite da štedite za porodičnu sigurnost iznad svega.",
        "Finanzielle Sicherheit ist mit emotionalem Wohlbefinden verbunden. Du verdienst gut in fursorglichen Bereichen und neigst dazu, vor allem fur die Familiensicherheit zu sparen.",
    ),
    "Leo": (
        "You attract money through creativity, generosity, and personal charisma. You enjoy spending on quality and luxury, and earn through self-expression.",
        "Privlačite novac kroz kreativnost, velikodušnost i ličnu harizmu. Uživate u trošenju na kvalitet i luksuz, a zarađujete kroz samizražavanje.",
        "Du ziehst Geld durch Kreativitat, Grosszugigkeit und personliches Charisma an. Du geniesst es, fur Qualitat und Luxus auszugeben, und verdienst durch Selbstausdruck.",
    ),
    "Virgo": (
        "You earn through meticulous skill and service. Budgeting comes naturally, though you may undervalue your own worth. Precision-based work pays best.",
        "Zarađujete kroz pedantnu veštinu i službu. Budžetiranje vam dolazi prirodno, mada možete potceniti sopstvenu vrednost. Rad baziran na preciznosti se najbolje plaća.",
        "Du verdienst durch sorgfaltige Fahigkeiten und Dienst. Budgetierung fallt dir leicht, obwohl du deinen eigenen Wert unterschatzen konntest. Prazisionsarbeit zahlt sich am besten aus.",
    ),
    "Libra": (
        "You earn best in partnership or aesthetically-driven fields. Financial balance matters — you seek fairness in compensation and beauty in what you invest in.",
        "Najbolje zarađujete u partnerstvu ili estetski vođenim oblastima. Finansijska ravnoteža je važna — tražite pravičnost u kompenzaciji i lepotu u onome u šta investirate.",
        "Du verdienst am besten in Partnerschaften oder asthetisch orientierten Bereichen. Finanzielle Balance ist wichtig — du suchst Fairness bei Vergutung und Schonheit bei Investitionen.",
    ),
    "Scorpio": (
        "You have powerful instincts about money and investments. Shared resources, inheritances, and strategic financial moves can be significant wealth sources.",
        "Imate snažne instinkte za novac i investicije. Zajednički resursi, nasledstva i strateški finansijski potezi mogu biti značajni izvori bogatstva.",
        "Du hast kraftige Instinkte fur Geld und Investitionen. Gemeinsame Ressourcen, Erbschaften und strategische Finanzbewegungen konnen bedeutende Vermogensquellen sein.",
    ),
    "Sagittarius": (
        "You attract abundance through optimism and big-picture thinking. International business or education-related income streams can be particularly profitable.",
        "Privlačite obilje kroz optimizam i razmišljanje o velikoj slici. Međunarodni poslovi ili tokovi prihoda vezani za obrazovanje mogu biti posebno profitabilni.",
        "Du ziehst Uberfluss durch Optimismus und Weitblick an. Internationales Geschaft oder bildungsbezogene Einkommensquellen konnen besonders profitabel sein.",
    ),
    "Capricorn": (
        "You build wealth through discipline, long-term planning, and steady career advancement. Financial maturity comes early, and your money habits are solid.",
        "Gradite bogatstvo kroz disciplinu, dugoročno planiranje i stabilan karijerni napredak. Finansijska zrelost dolazi rano, a vaše novčane navike su čvrste.",
        "Du baust Vermogen durch Disziplin, langfristige Planung und stetigen Karriereaufstieg auf. Finanzielle Reife kommt fruh, und deine Geldgewohnheiten sind solide.",
    ),
    "Aquarius": (
        "Your income may come through unconventional or technology-driven sources. You value financial independence over wealth accumulation for its own sake.",
        "Vaš prihod može doći kroz nekonvencionalne ili tehnološki vođene izvore. Cenite finansijsku nezavisnost više nego akumulaciju bogatstva samu po sebi.",
        "Dein Einkommen kann aus unkonventionellen oder technologiegetriebenen Quellen stammen. Du schatzt finanzielle Unabhangigkeit mehr als Vermogensanhaufung um ihrer selbst willen.",
    ),
    "Pisces": (
        "Money flows in intuitive, sometimes unpredictable ways. Creative and spiritual work can be surprisingly lucrative. Trust your instincts about financial timing.",
        "Novac teče na intuitivan, ponekad nepredvidiv način. Kreativni i duhovni rad može biti iznenađujuće unostan. Verujte svojim instinktima o finansijskom tajmingu.",
        "Geld fliesst auf intuitive, manchmal unvorhersehbare Weise. Kreative und spirituelle Arbeit kann uberraschend lukrativ sein. Vertraue deinen Instinkten beim finanziellen Timing.",
    ),
}

# ── HEALTH: ASC sign (constitution) ─────────────────────────────────────
_ASC_HEALTH: dict[str, tuple[str, str, str]] = {
    "Aries": (
        "You have a strong, athletic constitution with high physical energy. Watch for head-related issues, inflammation, and stress from overexertion. Regular physical activity is essential for your well-being.",
        "Imate snažnu, atletsku konstituciju sa visokom fizičkom energijom. Pazite na probleme vezane za glavu, upale i stres od preteranog napora. Redovna fizička aktivnost je neophodna za vaše blagostanje.",
        "Du hast eine starke, athletische Konstitution mit hoher korperlicher Energie. Achte auf Kopfprobleme, Entzundungen und Stress durch Uberanstrengung. Regelmassige korperliche Aktivitat ist wesentlich fur dein Wohlbefinden.",
    ),
    "Taurus": (
        "Your constitution is robust and enduring, with a strong connection to physical pleasure. The throat, thyroid, and neck are sensitive areas. Maintaining a balanced diet is crucial for your health.",
        "Vaša konstitucija je robusna i izdržljiva, sa jakom vezom za fizičko zadovoljstvo. Grlo, štitna žlezda i vrat su osetljiva područja. Održavanje uravnotežene ishrane je ključno za vaše zdravlje.",
        "Deine Konstitution ist robust und ausdauernd, mit einer starken Verbindung zu korperlichem Genuss. Hals, Schilddruse und Nacken sind empfindliche Bereiche. Eine ausgewogene Ernahrung ist entscheidend fur deine Gesundheit.",
    ),
    "Gemini": (
        "Your nervous system is your health barometer. Anxiety, respiratory issues, and restlessness are signals to slow down. Breathing exercises and mental calm practices benefit you greatly.",
        "Vaš nervni sistem je barometar vašeg zdravlja. Anksioznost, respiratorni problemi i nemir su signali da usporite. Vežbe disanja i prakse za mentalni mir vam uveliko koriste.",
        "Dein Nervensystem ist dein Gesundheitsbarometer. Angst, Atemprobleme und Unruhe sind Signale zum Entschleunigen. Atemubungen und mentale Beruhigungspraktiken nutzen dir sehr.",
    ),
    "Cancer": (
        "Your health is closely linked to your emotional state. The stomach, digestion, and chest are sensitive areas. Emotional stress often manifests physically — nurturing yourself is your best medicine.",
        "Vaše zdravlje je usko povezano sa vašim emocionalnim stanjem. Stomak, varenje i grudni koš su osetljiva područja. Emocionalni stres se često manifestuje fizički — briga o sebi je vaš najbolji lek.",
        "Deine Gesundheit ist eng mit deinem emotionalen Zustand verbunden. Magen, Verdauung und Brustbereich sind empfindliche Bereiche. Emotionaler Stress manifestiert sich oft korperlich — Selbstfursorge ist deine beste Medizin.",
    ),
    "Leo": (
        "You have a vital, warm constitution with strong recuperative power. The heart and spine need attention. Joy, creative expression, and play are genuine health necessities for you.",
        "Imate vitalnu, toplu konstituciju sa snažnom moći oporavka. Srce i kičma zahtevaju pažnju. Radost, kreativno izražavanje i igra su prave zdravstvene potrebe za vas.",
        "Du hast eine vitale, warme Konstitution mit starker Erholungskraft. Herz und Wirbelsaule brauchen Aufmerksamkeit. Freude, kreativer Ausdruck und Spiel sind echte Gesundheitsnotwendigkeiten fur dich.",
    ),
    "Virgo": (
        "You are health-conscious by nature, with a sensitive digestive system. Worry and overthinking affect your body directly. A structured wellness routine with clean eating keeps you at your best.",
        "Po prirodi ste svesni zdravlja, sa osetljivim digestivnim sistemom. Briga i preterano razmišljanje direktno utiču na vaše telo. Strukturirana wellness rutina sa čistom ishranom vas održava u najboljoj formi.",
        "Du bist von Natur aus gesundheitsbewusst, mit einem empfindlichen Verdauungssystem. Sorgen und Uberdenken beeinflussen deinen Korper direkt. Eine strukturierte Wellness-Routine mit sauberer Ernahrung halt dich in Bestform.",
    ),
    "Libra": (
        "Your health depends on balance in all things — diet, exercise, work, and rest. The kidneys and lower back are vulnerable areas. Beauty and pleasant surroundings genuinely boost your wellness.",
        "Vaše zdravlje zavisi od ravnoteže u svemu — ishrani, vežbanju, poslu i odmoru. Bubrezi i donji deo leđa su ranjiva područja. Lepota i prijatno okruženje zaista poboljšavaju vaše blagostanje.",
        "Deine Gesundheit hangt von Balance in allen Dingen ab — Ernahrung, Bewegung, Arbeit und Ruhe. Nieren und unterer Rucken sind empfindliche Bereiche. Schonheit und angenehme Umgebung fordern dein Wohlbefinden tatsachlich.",
    ),
    "Scorpio": (
        "You have powerful regenerative abilities but tend to push through illness rather than resting. The reproductive system and elimination organs need care. Emotional release is essential for physical health.",
        "Imate snažne regenerativne sposobnosti, ali imate tendenciju da se probijate kroz bolest umesto da se odmarate. Reproduktivni sistem i organi za eliminaciju zahtevaju brigu. Emocionalno oslobađanje je neophodno za fizičko zdravlje.",
        "Du hast starke regenerative Fahigkeiten, neigst aber dazu, Krankheiten durchzustehen statt zu ruhen. Fortpflanzungssystem und Ausscheidungsorgane brauchen Pflege. Emotionale Befreiung ist wesentlich fur die korperliche Gesundheit.",
    ),
    "Sagittarius": (
        "You have a naturally optimistic and resilient constitution. The hips, thighs, and liver need attention. Outdoor activity and adventure are genuine health requirements — not luxuries.",
        "Imate prirodno optimističnu i otpornu konstituciju. Kukovi, butine i jetra zahtevaju pažnju. Aktivnosti na otvorenom i avantura su prave zdravstvene potrebe — ne luksuz.",
        "Du hast eine naturlich optimistische und widerstandsfahige Konstitution. Huften, Oberschenkel und Leber brauchen Aufmerksamkeit. Outdoor-Aktivitaten und Abenteuer sind echte Gesundheitsanforderungen — kein Luxus.",
    ),
    "Capricorn": (
        "Your constitution strengthens with age. Bones, joints, knees, and teeth are areas to monitor. Discipline in health routines pays off dramatically over time — you age remarkably well with consistent care.",
        "Vaša konstitucija jača sa godinama. Kosti, zglobovi, kolena i zubi su područja za praćenje. Disciplina u zdravstvenim rutinama se dramatično isplati tokom vremena — izvanredno starite sa doslednom brigom.",
        "Deine Konstitution wird mit dem Alter starker. Knochen, Gelenke, Knie und Zahne sind Bereiche zum Uberwachen. Disziplin in Gesundheitsroutinen zahlt sich dramatisch uber die Zeit aus — du alterst bemerkenswert gut mit konsequenter Pflege.",
    ),
    "Aquarius": (
        "Your health is connected to your nervous system and circulation. Ankles and calves are vulnerable. Stress from feeling constrained affects you physically — freedom and social connection are health requirements.",
        "Vaše zdravlje je povezano sa nervnim sistemom i cirkulacijom. Gležnjevi i listovi su ranjivi. Stres od osećaja ograničenosti fizički utiče na vas — sloboda i društvena povezanost su zdravstveni zahtevi.",
        "Deine Gesundheit ist mit dem Nervensystem und Kreislauf verbunden. Knochel und Waden sind empfindlich. Stress durch das Gefuhl der Einschrankung betrifft dich korperlich — Freiheit und soziale Verbindung sind Gesundheitsanforderungen.",
    ),
    "Pisces": (
        "Your health is deeply affected by your emotional and spiritual state. The feet, lymphatic system, and immune function are sensitive. Creative expression and spiritual practice are powerful healing tools for you.",
        "Vaše zdravlje je duboko pogođeno vašim emocionalnim i duhovnim stanjem. Stopala, limfni sistem i imunološka funkcija su osetljivi. Kreativno izražavanje i duhovna praksa su moćni alati za isceljenje za vas.",
        "Deine Gesundheit wird tief von deinem emotionalen und spirituellen Zustand beeinflusst. Fusse, Lymphsystem und Immunfunktion sind empfindlich. Kreativer Ausdruck und spirituelle Praxis sind kraftige Heilungswerkzeuge fur dich.",
    ),
}

# ── HEALTH: Sun sign (vitality) ─────────────────────────────────────────
_SUN_VITALITY: dict[str, tuple[str, str, str]] = {
    "Aries": (
        "Your vitality is fueled by action and challenge. Sedentary lifestyles drain you; competitive sports and physical challenges keep your energy peak.",
        "Vaša vitalnost je pogonjana akcijom i izazovom. Sedentarni način života vas iscrpljuje; takmičarski sportovi i fizički izazovi održavaju vašu energiju na vrhuncu.",
        "Deine Vitalitat wird von Aktion und Herausforderung gespeist. Sitzende Lebensweise erschopft dich; Wettkampfsport und korperliche Herausforderungen halten deine Energie auf dem Hohepunkt.",
    ),
    "Taurus": (
        "Your energy is steady and enduring. Nature, good food, and sensory pleasure recharge you. Overindulgence is the main health risk to monitor.",
        "Vaša energija je stabilna i trajna. Priroda, dobra hrana i čulno zadovoljstvo vas pune. Preterano uživanje je glavni zdravstveni rizik koji treba pratiti.",
        "Deine Energie ist stetig und ausdauernd. Natur, gutes Essen und Sinnesfreuden laden dich auf. Ubermassiger Genuss ist das hauptsachliche Gesundheitsrisiko.",
    ),
    "Gemini": (
        "Your vitality depends on mental engagement. Boredom is genuinely harmful to your health. Walking, variety, and social activity keep your energy balanced.",
        "Vaša vitalnost zavisi od mentalne angažovanosti. Dosada je zaista štetna po vaše zdravlje. Hodanje, raznolikost i društvene aktivnosti održavaju vašu energiju u ravnoteži.",
        "Deine Vitalitat hangt von geistiger Beschaftigung ab. Langeweile ist tatsachlich schadlich fur deine Gesundheit. Gehen, Abwechslung und soziale Aktivitat halten deine Energie im Gleichgewicht.",
    ),
    "Cancer": (
        "Your energy fluctuates with your emotions. When emotionally nourished, you have deep reserves. Water-based activities and cooking are both therapeutic and energizing.",
        "Vaša energija fluktuira sa vašim emocijama. Kada ste emocionalno nahranjeni, imate duboke rezerve. Aktivnosti vezane za vodu i kuvanje su istovremeno terapeutske i energizirajuće.",
        "Deine Energie schwankt mit deinen Emotionen. Wenn du emotional genahrt bist, hast du tiefe Reserven. Wasseraktivitaten und Kochen sind sowohl therapeutisch als auch energetisierend.",
    ),
    "Leo": (
        "Your vitality is solar-powered — literally. Sunlight, joy, and creative play recharge you. A lack of fun and recognition genuinely depletes your health.",
        "Vaša vitalnost je solarna — bukvalno. Sunčeva svetlost, radost i kreativna igra vas pune. Nedostatak zabave i priznanja zaista iscrpljuje vaše zdravlje.",
        "Deine Vitalitat ist sonnengespeist — buchstablich. Sonnenlicht, Freude und kreatives Spiel laden dich auf. Ein Mangel an Spass und Anerkennung erschopft tatsachlich deine Gesundheit.",
    ),
    "Virgo": (
        "Your energy thrives with routine and clean living. You respond strongly to diet quality — what you eat directly shapes your vitality. Mindfulness counteracts your tendency to worry.",
        "Vaša energija napreduje sa rutinom i čistim životom. Snažno reagujete na kvalitet ishrane — ono što jedete direktno oblikuje vašu vitalnost. Svesnost suprotstavlja vašoj tendenciji da brinete.",
        "Deine Energie gedeiht mit Routine und gesundem Leben. Du reagierst stark auf Ernahrungsqualitat — was du isst, formt direkt deine Vitalitat. Achtsamkeit wirkt deiner Neigung zum Sorgen entgegen.",
    ),
    "Libra": (
        "Your vitality depends on harmony in your environment. Conflict and ugliness genuinely drain you. Beautiful spaces, music, and balanced relationships restore your health.",
        "Vaša vitalnost zavisi od harmonije u vašem okruženju. Konflikt i ružnoća vas zaista iscrpljuju. Lepi prostori, muzika i uravnoteženi odnosi obnavljaju vaše zdravlje.",
        "Deine Vitalitat hangt von Harmonie in deiner Umgebung ab. Konflikte und Hasslichkeit erschopfen dich wirklich. Schone Raume, Musik und ausgewogene Beziehungen stellen deine Gesundheit wieder her.",
    ),
    "Scorpio": (
        "Your energy runs deep and intense. You can endure remarkable challenges but need periodic emotional purging. Transformation — physical and emotional — is your healing mechanism.",
        "Vaša energija je duboka i intenzivna. Možete izdržati izvanredne izazove, ali vam je potrebno periodično emocionalno pročišćavanje. Transformacija — fizička i emocionalna — je vaš mehanizam isceljenja.",
        "Deine Energie ist tief und intensiv. Du kannst bemerkenswerte Herausforderungen durchstehen, brauchst aber periodische emotionale Reinigung. Transformation — korperlich und emotional — ist dein Heilungsmechanismus.",
    ),
    "Sagittarius": (
        "Your vitality thrives on adventure, purpose, and movement. Travel, outdoor pursuits, and philosophical inspiration keep your fire burning bright.",
        "Vaša vitalnost napreduje na avanturi, svrsi i pokretu. Putovanja, aktivnosti na otvorenom i filozofska inspiracija održavaju vaš oganj živim.",
        "Deine Vitalitat gedeiht durch Abenteuer, Sinn und Bewegung. Reisen, Outdoor-Aktivitaten und philosophische Inspiration halten dein Feuer am Brennen.",
    ),
    "Capricorn": (
        "Your stamina is exceptional but you often ignore your body's signals until forced to stop. Regular preventive care and allowing yourself rest are essential health strategies.",
        "Vaša izdržljivost je izuzetna, ali često ignorišete signale tela dok niste primorani da stanete. Redovna preventivna briga i dozvolite sebi odmor su ključne zdravstvene strategije.",
        "Deine Ausdauer ist aussergewohnlich, aber du ignorierst oft die Signale deines Korpers, bis du gezwungen bist aufzuhoren. Regelmassige Vorsorge und dir Ruhe zu erlauben sind wesentliche Gesundheitsstrategien.",
    ),
    "Aquarius": (
        "Your energy is electric and unpredictable. Mental stimulation and social purpose fuel you. Grounding practices and regular circulation-boosting exercise balance your high-frequency energy.",
        "Vaša energija je električna i nepredvidiva. Mentalna stimulacija i društvena svrha vas pokreću. Prakse uzemljenja i redovne vežbe za poboljšanje cirkulacije uravnotežuju vašu visokofrekventnu energiju.",
        "Deine Energie ist elektrisch und unvorhersehbar. Geistige Anregung und sozialer Sinn treiben dich an. Erdungspraktiken und regelmassige kreislauffordernde Bewegung balancieren deine hochfrequente Energie aus.",
    ),
    "Pisces": (
        "Your energy is sensitive and absorbs your environment. You need regular solitude and spiritual practice to recharge. Water therapy, swimming, and creative arts are your best medicines.",
        "Vaša energija je osetljiva i upija vaše okruženje. Potrebna vam je redovna samoća i duhovna praksa za punjenje. Hidroterapija, plivanje i kreativne umetnosti su vaši najbolji lekovi.",
        "Deine Energie ist sensitiv und absorbiert deine Umgebung. Du brauchst regelmassige Einsamkeit und spirituelle Praxis zum Aufladen. Wassertherapie, Schwimmen und kreative Kunste sind deine besten Heilmittel.",
    ),
}

# ── HEALTH: 6th house sign (health habits) ──────────────────────────────
_SIXTH_HOUSE: dict[str, tuple[str, str, str]] = {
    "Aries": (
        "You benefit from high-intensity workouts and competitive fitness routines. Your health improves when you channel excess energy into vigorous physical activity.",
        "Korist vam donose visokointenzivni treninzi i takmičarske fitnes rutine. Vaše zdravlje se poboljšava kada usmerite višak energije u snažnu fizičku aktivnost.",
        "Du profitierst von hochintensivem Training und wettbewerbsorientierten Fitnessroutinen. Deine Gesundheit verbessert sich, wenn du uberschussige Energie in kraftige korperliche Aktivitat lenkst.",
    ),
    "Taurus": (
        "Slow, consistent health routines work best. Yoga, walking in nature, and a nutritious diet are your most effective wellness tools. Avoid crash diets.",
        "Spore, dosledne zdravstvene rutine najbolje funkcionišu. Joga, šetnje u prirodi i nutritivna ishrana su vaši najefikasniji alati za zdravlje. Izbegavajte drastične dijete.",
        "Langsame, konsequente Gesundheitsroutinen funktionieren am besten. Yoga, Spaziergange in der Natur und eine nahrhafte Ernahrung sind deine effektivsten Wellness-Werkzeuge. Vermeide Crash-Diaten.",
    ),
    "Gemini": (
        "Variety in your fitness routine prevents boredom and dropout. Dance, cycling, group sports, and activities that engage both mind and body suit you best.",
        "Raznolikost u fitnes rutini sprečava dosadu i odustajanje. Ples, vožnja bicikla, grupski sportovi i aktivnosti koje angažuju i um i telo vam najbolje odgovaraju.",
        "Abwechslung in deiner Fitnessroutine verhindert Langeweile und Abbruch. Tanz, Radfahren, Gruppensport und Aktivitaten, die Geist und Korper ansprechen, passen am besten zu dir.",
    ),
    "Cancer": (
        "Home-based wellness routines and emotional self-care are key. Swimming, cooking healthy meals, and nurturing rituals support your health best.",
        "Wellness rutine kod kuće i emocionalna briga o sebi su ključni. Plivanje, kuvanje zdravih obroka i rituali nege najbolje podržavaju vaše zdravlje.",
        "Hausliche Wellness-Routinen und emotionale Selbstfursorge sind der Schlussel. Schwimmen, gesundes Kochen und pflegende Rituale unterstutzen deine Gesundheit am besten.",
    ),
    "Leo": (
        "Fun and joy must be part of your health routine or you won't stick with it. Group fitness, dancing, and playful sports keep you motivated and glowing.",
        "Zabava i radost moraju biti deo vaše zdravstvene rutine ili se nećete držati toga. Grupni fitnes, ples i razigrani sportovi vas održavaju motivisanim i blistavim.",
        "Spass und Freude mussen Teil deiner Gesundheitsroutine sein, sonst bleibst du nicht dabei. Gruppenfitness, Tanzen und spielerische Sportarten halten dich motiviert und strahlend.",
    ),
    "Virgo": (
        "You naturally gravitate toward clean eating and organized health regimens. Detailed tracking of nutrition and exercise helps, but avoid health anxiety from overanalyzing.",
        "Prirodno gravitate ka čistoj ishrani i organizovanim zdravstvenim režimima. Detaljno praćenje ishrane i vežbanja pomaže, ali izbegavajte zdravstvenu anksioznost od preteranog analiziranja.",
        "Du neigst naturlich zu sauberer Ernahrung und organisierten Gesundheitsprogrammen. Detailliertes Tracking von Ernahrung und Bewegung hilft, aber vermeide Gesundheitsangst durch Uberanalysieren.",
    ),
    "Libra": (
        "Partner workouts and aesthetically pleasing fitness environments motivate you. Balance between activity and rest is your health golden rule.",
        "Treninzi sa partnerom i estetski prijatna fitnes okruženja vas motivišu. Ravnoteža između aktivnosti i odmora je vaše zdravstveno zlatno pravilo.",
        "Partner-Workouts und asthetisch ansprechende Fitnessumgebungen motivieren dich. Balance zwischen Aktivitat und Ruhe ist deine goldene Gesundheitsregel.",
    ),
    "Scorpio": (
        "Intense, transformative fitness practices suit you — martial arts, power training, and deep-tissue bodywork. You respond well to detox protocols and fasting.",
        "Intenzivne, transformativne fitnes prakse vam odgovaraju — borilačke veštine, trening snage i dubinski rad na telu. Dobro reagujete na detoks protokole i post.",
        "Intensive, transformative Fitnesspraktiken passen zu dir — Kampfkunste, Krafttraining und Tiefengewebe-Korperarbeit. Du reagierst gut auf Detox-Protokolle und Fasten.",
    ),
    "Sagittarius": (
        "Outdoor fitness, hiking, horseback riding, and adventurous physical activities are your best medicine. Monotonous gym routines kill your motivation.",
        "Fitnes na otvorenom, planinarenje, jahanje i avanturističke fizičke aktivnosti su vaš najbolji lek. Monotone gimnastičke rutine ubijaju vašu motivaciju.",
        "Outdoor-Fitness, Wandern, Reiten und abenteuerliche korperliche Aktivitaten sind deine beste Medizin. Monotone Gym-Routinen toten deine Motivation.",
    ),
    "Capricorn": (
        "Structured, goal-oriented fitness plans work best. You excel with measurable targets and disciplined routines. Don't neglect joint flexibility and rest days.",
        "Strukturisani, ciljno orijentisani fitnes planovi najbolje funkcionišu. Izvanredni ste sa merljivim ciljevima i disciplinovanim rutinama. Ne zanemarujte fleksibilnost zglobova i dane odmora.",
        "Strukturierte, zielorientierte Fitnessplane funktionieren am besten. Du bist hervorragend mit messbaren Zielen und disziplinierten Routinen. Vernachlassige nicht Gelenkflexibilitat und Ruhetage.",
    ),
    "Aquarius": (
        "Unconventional fitness approaches appeal to you — aerial yoga, electric muscle stimulation, or group community sports. Technology-assisted health tracking suits your nature.",
        "Nekonvencionalni fitnes pristupi vam se dopadaju — aerial joga, električna stimulacija mišića ili grupni sportovi u zajednici. Tehnološki potpomognuto praćenje zdravlja odgovara vašoj prirodi.",
        "Unkonventionelle Fitness-Ansatze sprechen dich an — Aerial Yoga, elektrische Muskelstimulation oder Gemeinschaftssport. Technologiegestutzte Gesundheitsuberwachung entspricht deiner Natur.",
    ),
    "Pisces": (
        "Water-based exercise, gentle yoga, tai chi, and movement with music are your ideal health practices. Your body responds beautifully to rhythmic, flowing activities.",
        "Vežbe u vodi, nežna joga, tai chi i pokret uz muziku su vaše idealne zdravstvene prakse. Vaše telo prelepo reaguje na ritmičke, tečne aktivnosti.",
        "Wasserbasierte Bewegung, sanftes Yoga, Tai Chi und Bewegung mit Musik sind deine idealen Gesundheitspraktiken. Dein Korper reagiert wunderbar auf rhythmische, fliessende Aktivitaten.",
    ),
}

# ── Topic titles & section headers ──────────────────────────────────────
_TOPIC_TITLES: dict[str, tuple[str, str, str]] = {
    "love": ("Love & Relationships", "Ljubav i Odnosi", "Liebe & Beziehungen"),
    "work": ("Work & Money", "Posao i Novac", "Arbeit & Geld"),
    "health": ("Health & Vitality", "Zdravlje i Vitalnost", "Gesundheit & Vitalitat"),
}

_SECTION_HEADERS: dict[str, dict[str, tuple[str, str, str]]] = {
    "love": {
        "venus": ("Your Love Style", "Vaš Stil Ljubavi", "Dein Liebesstil"),
        "moon": ("Your Emotional Needs", "Vaše Emocionalne Potrebe", "Deine Emotionalen Bedurfnisse"),
        "dsc": ("What You Attract in Partners", "Šta Privlačite u Partnerima", "Was du bei Partnern anziehst"),
    },
    "work": {
        "mc": ("Your Career Direction", "Vaš Karijerni Pravac", "Deine Karriererichtung"),
        "saturn": ("Your Work Challenges", "Vaši Radni Izazovi", "Deine Beruflichen Herausforderungen"),
        "money": ("Your Money Approach", "Vaš Odnos prema Novcu", "Dein Umgang mit Geld"),
    },
    "health": {
        "asc": ("Your Constitution", "Vaša Konstitucija", "Deine Konstitution"),
        "sun": ("Your Vitality Source", "Vaš Izvor Vitalnosti", "Deine Vitalitatquelle"),
        "habits": ("Your Health Habits", "Vaše Zdravstvene Navike", "Deine Gesundheitsgewohnheiten"),
    },
}


def _li(idx: int) -> int:
    return SUPPORTED_LANGS.index(SUPPORTED_LANGS[idx])


def _get_lang_idx(lang: str) -> int:
    if lang in SUPPORTED_LANGS:
        return SUPPORTED_LANGS.index(lang)
    return 0


def generate_life_reading(
    chart: NatalChart,
    lang: str = "en",
) -> dict[str, dict[str, Any]]:
    """Generate structured life-topic readings from a natal chart.

    Returns:
        {
            "love":   {"title": str, "sections": [{"heading": str, "text": str}, ...]},
            "work":   {"title": str, "sections": [...]},
            "health": {"title": str, "sections": [...]},
        }
    """
    idx = _get_lang_idx(lang)

    venus = _find_planet(chart, "Venus")
    moon = _find_planet(chart, "Moon")
    sun = _find_planet(chart, "Sun")
    saturn = _find_planet(chart, "Saturn")

    dsc_sign = _sign_at(chart.houses.descendant)
    mc_sign = _sign_at(chart.houses.midheaven)
    asc_sign = _sign_at(chart.houses.ascendant)
    second_house_sign = _sign_at(chart.houses.cusps[1])
    sixth_house_sign = _sign_at(chart.houses.cusps[5])

    love_sections = []
    if venus:
        love_sections.append({
            "heading": _SECTION_HEADERS["love"]["venus"][idx],
            "planet": venus.name,
            "sign": venus.sign,
            "text": _pick(_VENUS_SIGN, venus.sign, lang),
        })
    if moon:
        love_sections.append({
            "heading": _SECTION_HEADERS["love"]["moon"][idx],
            "planet": moon.name,
            "sign": moon.sign,
            "text": _pick(_MOON_LOVE, moon.sign, lang),
        })
    love_sections.append({
        "heading": _SECTION_HEADERS["love"]["dsc"][idx],
        "planet": "DSC",
        "sign": dsc_sign,
        "text": _pick(_DSC_SIGN, dsc_sign, lang),
    })

    work_sections = []
    work_sections.append({
        "heading": _SECTION_HEADERS["work"]["mc"][idx],
        "planet": "MC",
        "sign": mc_sign,
        "text": _pick(_MC_SIGN, mc_sign, lang),
    })
    if saturn:
        work_sections.append({
            "heading": _SECTION_HEADERS["work"]["saturn"][idx],
            "planet": saturn.name,
            "sign": saturn.sign,
            "text": _pick(_SATURN_SIGN, saturn.sign, lang),
        })
    work_sections.append({
        "heading": _SECTION_HEADERS["work"]["money"][idx],
        "planet": "2nd House",
        "sign": second_house_sign,
        "text": _pick(_SECOND_HOUSE, second_house_sign, lang),
    })

    health_sections = []
    health_sections.append({
        "heading": _SECTION_HEADERS["health"]["asc"][idx],
        "planet": "ASC",
        "sign": asc_sign,
        "text": _pick(_ASC_HEALTH, asc_sign, lang),
    })
    if sun:
        health_sections.append({
            "heading": _SECTION_HEADERS["health"]["sun"][idx],
            "planet": sun.name,
            "sign": sun.sign,
            "text": _pick(_SUN_VITALITY, sun.sign, lang),
        })
    health_sections.append({
        "heading": _SECTION_HEADERS["health"]["habits"][idx],
        "planet": "6th House",
        "sign": sixth_house_sign,
        "text": _pick(_SIXTH_HOUSE, sixth_house_sign, lang),
    })

    return {
        "love": {
            "title": _TOPIC_TITLES["love"][idx],
            "sections": love_sections,
        },
        "work": {
            "title": _TOPIC_TITLES["work"][idx],
            "sections": work_sections,
        },
        "health": {
            "title": _TOPIC_TITLES["health"][idx],
            "sections": health_sections,
        },
    }
