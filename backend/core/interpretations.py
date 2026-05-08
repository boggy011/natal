"""Static lookup tables for astrological interpretations (EN). Stable interface for future LLM swap."""

PLANET_IN_SIGN: dict[tuple[str, str], str] = {
    ("Sun", "Aries"): "Bold self-expression, pioneering spirit, natural leadership with impulsive tendencies.",
    ("Sun", "Taurus"): "Steady determination, sensual appreciation, strong values with a love of comfort and stability.",
    ("Sun", "Gemini"): "Curious and communicative nature, versatile intellect, adaptable with a need for variety.",
    ("Sun", "Cancer"): "Deeply nurturing, emotionally intuitive, protective of loved ones with strong family bonds.",
    ("Sun", "Leo"): "Radiant confidence, creative self-expression, generous warmth with a desire for recognition.",
    ("Sun", "Virgo"): "Analytical precision, service-oriented approach, practical skills with attention to detail.",
    ("Sun", "Libra"): "Harmonious and diplomatic nature, aesthetic sensibility, partnership-oriented with a love of balance.",
    ("Sun", "Scorpio"): "Intense depth, transformative power, penetrating insight with unwavering determination.",
    ("Sun", "Sagittarius"): "Expansive optimism, philosophical nature, love of freedom and adventure.",
    ("Sun", "Capricorn"): "Ambitious discipline, responsible leadership, practical achievement with long-term vision.",
    ("Sun", "Aquarius"): "Independent thinking, humanitarian ideals, innovative vision with unconventional approach.",
    ("Sun", "Pisces"): "Compassionate sensitivity, artistic imagination, spiritual depth with empathic awareness.",
    ("Moon", "Aries"): "Emotionally direct and impulsive, needs independence, quick to react but also quick to recover.",
    ("Moon", "Taurus"): "Emotionally stable and grounded, needs security and comfort, deeply loyal in attachments.",
    ("Moon", "Gemini"): "Emotionally versatile, needs mental stimulation, processes feelings through communication.",
    ("Moon", "Cancer"): "Deeply emotional and intuitive, strong need for home and family, naturally nurturing.",
    ("Moon", "Leo"): "Emotionally warm and expressive, needs admiration and creative outlets, generous spirit.",
    ("Moon", "Virgo"): "Emotionally reserved, needs order and usefulness, shows care through practical service.",
    ("Moon", "Libra"): "Emotionally balanced, needs harmony in relationships, diplomatic in emotional expression.",
    ("Moon", "Scorpio"): "Emotionally intense and private, deep attachments, powerful intuition and resilience.",
    ("Moon", "Sagittarius"): "Emotionally optimistic and restless, needs freedom and meaning, adventurous spirit.",
    ("Moon", "Capricorn"): "Emotionally controlled and responsible, needs achievement, cautious but deeply loyal.",
    ("Moon", "Aquarius"): "Emotionally detached but caring, needs intellectual connection, values emotional independence.",
    ("Moon", "Pisces"): "Emotionally sensitive and empathic, needs spiritual connection, rich inner life.",
}

PLANET_IN_HOUSE: dict[tuple[str, int], str] = {
    ("Sun", 1): "Strong sense of identity, natural leadership qualities, life purpose expressed through personal action.",
    ("Sun", 2): "Self-worth tied to material security, talent for building resources, values-driven identity.",
    ("Sun", 3): "Identity expressed through communication, intellectual curiosity, connection with community.",
    ("Sun", 4): "Deep roots in family and home, private nature, identity shaped by heritage and emotional foundations.",
    ("Sun", 5): "Creative self-expression at the core, joy through romance and play, generous spirit.",
    ("Sun", 6): "Identity through service and skill, dedication to health and improvement, meticulous nature.",
    ("Sun", 7): "Self-discovery through partnerships, diplomatic nature, identity reflected in relationships.",
    ("Sun", 8): "Transformative life path, deep psychological insight, power through shared resources.",
    ("Sun", 9): "Philosophical seeker, identity expanded through travel and higher learning, visionary.",
    ("Sun", 10): "Ambitious career focus, public recognition, identity tied to achievement and authority.",
    ("Sun", 11): "Community-oriented, identity through group involvement, humanitarian ideals and friendships.",
    ("Sun", 12): "Spiritual depth, behind-the-scenes influence, identity connected to the collective unconscious.",
    ("Moon", 1): "Emotional nature is prominent, moods shape self-presentation, instinctive reactions visible to all.",
    ("Moon", 4): "Strongest placement for the Moon — deep need for home security, family is emotional anchor.",
    ("Moon", 7): "Emotional fulfillment through partnerships, responsive to others' needs, relational intuition.",
    ("Moon", 10): "Emotional investment in career and public standing, nurturing leadership style.",
}

ASPECT_MEANING: dict[tuple[str, str, str], str] = {
    ("Sun", "conjunction", "Moon"): "Unified will and emotions, strong inner alignment, personality operates as a cohesive whole.",
    ("Sun", "opposition", "Moon"): "Tension between conscious will and emotional needs, relationships reveal inner conflicts.",
    ("Sun", "square", "Moon"): "Inner friction between identity and instincts, growth comes through resolving internal conflicts.",
    ("Sun", "trine", "Moon"): "Natural harmony between will and feelings, inner ease and self-acceptance.",
    ("Sun", "conjunction", "Mercury"): "Intellectual identity, mind and ego closely linked, strong communicator.",
    ("Sun", "conjunction", "Venus"): "Charming and graceful, artistic nature, values beauty and harmony in self-expression.",
    ("Sun", "square", "Mars"): "Dynamic tension between will and action, competitive drive, must manage anger constructively.",
    ("Sun", "conjunction", "Jupiter"): "Expansive and optimistic nature, natural luck, generous spirit with broad vision.",
    ("Sun", "square", "Saturn"): "Discipline through difficulty, authority issues to resolve, delayed but lasting success.",
    ("Sun", "conjunction", "Pluto"): "Intense personal power, transformative life path, deep psychological awareness.",
    ("Moon", "conjunction", "Venus"): "Emotional warmth and artistic sensitivity, nurturing through beauty, harmonious feelings.",
    ("Moon", "square", "Mars"): "Emotional volatility, passionate reactions, must learn to channel strong feelings constructively.",
    ("Moon", "opposition", "Saturn"): "Emotional restraint, feelings of duty over joy, learning to balance responsibility with nurturing.",
    ("Venus", "conjunction", "Mars"): "Passionate nature, magnetic attraction, creative and sexual vitality.",
    ("Venus", "square", "Saturn"): "Love tested by duty, fears of rejection, deep loyalty earned through patience.",
    ("Mars", "conjunction", "Jupiter"): "Abundant energy, enthusiastic action, courage and optimism drive success.",
    ("Mars", "square", "Pluto"): "Intense willpower, power struggles, transformative drive that demands conscious direction.",
    ("Jupiter", "conjunction", "Saturn"): "Balance between expansion and contraction, realistic optimism, structured growth.",
    ("Saturn", "conjunction", "Pluto"): "Profound determination, restructuring of power, endurance through transformation.",
}

TRANSIT_MEANING: dict[tuple[str, str, str], str] = {
    ("Saturn", "conjunction", "Sun"): "A time of serious self-examination. New responsibilities demand maturity and authenticity.",
    ("Saturn", "opposition", "Sun"): "External challenges test your identity. Others may oppose your direction, requiring firm boundaries.",
    ("Saturn", "square", "Sun"): "Friction with authority or goals. Hard work required, but accomplishments are lasting.",
    ("Saturn", "conjunction", "Moon"): "Emotional sobriety. A period of emotional maturation, possible melancholy, restructuring home life.",
    ("Saturn", "conjunction", "Saturn"): "Saturn return — a major life milestone. Restructuring of life direction, taking on adult responsibilities.",
    ("Jupiter", "conjunction", "Sun"): "Expansion of identity and opportunities. Confidence grows, luck favors bold moves.",
    ("Jupiter", "trine", "Sun"): "Easy flow of opportunity and growth. A favorable period for personal and professional expansion.",
    ("Jupiter", "conjunction", "Moon"): "Emotional abundance, domestic expansion. Generosity and warmth increase.",
    ("Jupiter", "conjunction", "Venus"): "A blessed period for love and finances. Social life flourishes, beauty and pleasure are enhanced.",
    ("Pluto", "conjunction", "Sun"): "Profound personal transformation. Old identity structures dissolve to reveal deeper authenticity.",
    ("Pluto", "square", "Sun"): "Power struggles force evolution. Resisting change prolongs difficulty; embrace transformation.",
    ("Pluto", "conjunction", "Moon"): "Emotional transformation at the deepest level. Cathartic release, family dynamics shift fundamentally.",
    ("Uranus", "conjunction", "Sun"): "Radical awakening of identity. Sudden liberation from constraints, embrace of authenticity.",
    ("Uranus", "opposition", "Sun"): "Mid-life awakening. Sudden shifts in direction, breakthrough or breakdown depending on flexibility.",
    ("Uranus", "square", "Sun"): "Restlessness and disruption. Change is forced; resisting leads to crisis, adapting leads to freedom.",
    ("Neptune", "conjunction", "Sun"): "Dissolution of ego boundaries. Spiritual awakening, confusion about identity, heightened sensitivity.",
    ("Neptune", "square", "Sun"): "Illusions challenge identity. Discernment needed, creative and spiritual potential if boundaries maintained.",
    ("Mars", "conjunction", "Sun"): "Surge of energy and assertiveness. Time to initiate, compete, and express courage.",
    ("Mars", "square", "Sun"): "Conflicts and frustrations push growth. Physical energy high but needs constructive outlets.",
}


def planet_in_sign(planet: str, sign: str) -> str:
    key = (planet, sign)
    if key in PLANET_IN_SIGN:
        return PLANET_IN_SIGN[key]
    return f"{planet} in {sign} brings the qualities of {sign} to the domain of {planet}."


def planet_in_house(planet: str, house: int) -> str:
    key = (planet, house)
    if key in PLANET_IN_HOUSE:
        return PLANET_IN_HOUSE[key]
    return f"{planet} in the {house}{'st' if house == 1 else 'nd' if house == 2 else 'rd' if house == 3 else 'th'} house emphasizes {planet}'s themes in this life area."


def aspect_meaning(planet1: str, aspect: str, planet2: str) -> str:
    for key in [(planet1, aspect, planet2), (planet2, aspect, planet1)]:
        if key in ASPECT_MEANING:
            return ASPECT_MEANING[key]
    return f"{planet1} {aspect} {planet2} creates a dynamic interplay between these planetary energies."


def transit_meaning(transit: str, aspect: str, natal: str) -> str:
    key = (transit, aspect, natal)
    if key in TRANSIT_MEANING:
        return TRANSIT_MEANING[key]
    return f"Transiting {transit} {aspect} natal {natal} activates themes of change and growth in this area."
