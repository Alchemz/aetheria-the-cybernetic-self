import * as AstronomyEngine from 'astronomy-engine';
const Astronomy = AstronomyEngine.default || AstronomyEngine;

export const CosmicIntelligence = {
    /**
     * Get the current moon phase relative to Earth.
     * @param {Date} date 
     * @returns {Object} phase info
     */
    getMoonPhase: (date = new Date()) => {
        const illumination = Astronomy.Illumination("Moon", date);
        const phaseAngle = illumination.phase_angle; // 0 to 360
        let phaseName = 'New Moon';
        // Approximate phase mapping
        if (phaseAngle < 15) phaseName = 'New Moon';
        else if (phaseAngle < 75) phaseName = 'Waxing Crescent';
        else if (phaseAngle < 105) phaseName = 'First Quarter';
        else if (phaseAngle < 165) phaseName = 'Waxing Gibbous';
        else if (phaseAngle < 195) phaseName = 'Full Moon';
        else if (phaseAngle < 255) phaseName = 'Waning Gibbous';
        else if (phaseAngle < 285) phaseName = 'Last Quarter';
        else if (phaseAngle < 345) phaseName = 'Waning Crescent';

        return {
            fraction: illumination.phase_fraction, // 0.0 to 1.0
            name: phaseName,
            angle: phaseAngle
        };
    },

    /**
     * Determine if a planet is in apparent retrograde motion.
     * Calculated by comparing longitude now vs tomorrow. 
     * If longitude decreases, it's retrograde.
     * @param {string} bodyName (e.g. 'Mercury', 'Venus')
     * @param {Date} date
     * @returns {boolean} isRetrograde
     */
    isRetrograde: (bodyName, date = new Date()) => {
        if (bodyName === 'Sun' || bodyName === 'Moon') return false;

        const today = date;
        const tomorrow = new Date(date);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const pos1 = Astronomy.Ecliptic(Astronomy.GeoVector(bodyName, today, true));
        const pos2 = Astronomy.Ecliptic(Astronomy.GeoVector(bodyName, tomorrow, true));

        // Check longitude velocity (approx)
        // If longitude decreases, it is retrograde.
        // Need to handle 360->0 boundary wrapping
        let diff = pos2.elon - pos1.elon;
        if (diff < -300) diff += 360; // Wrapping around 0

        return diff < 0;
    },

    /**
     * Generates a "Daily Briefing" object with active cosmic events.
     * @param {Date} date 
     * @returns {Object} briefing data
     */
    generateBriefing: (date = new Date()) => {
        const moon = CosmicIntelligence.getMoonPhase(date);

        // Check retrogrades for inner planets + major outer
        const planets = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
        const activeRetrogrades = planets.filter(p => CosmicIntelligence.isRetrograde(p, date));

        let introText = `The Moon is currently in its ${moon.name} phase (${Math.round(moon.fraction * 100)}% illumination). `;

        if (activeRetrogrades.length > 0) {
            introText += `Alert: ${activeRetrogrades.join(', ')} ${activeRetrogrades.length > 1 ? 'are' : 'is'} currently in retrograde motion. Expect delays in communication or structure. `;
        } else {
            introText += "Direct planetary motion supports forward action and clarity today. ";
        }

        // Simple alignment/aspect logic could go here (e.g. if Moon and Sun longitude are close)

        return {
            date: date,
            moon: moon,
            retrogrades: activeRetrogrades,
            message: introText,
            theme: activeRetrogrades.length > 0 ? "INTROSPECTION" : "EXPANSION"
        };
    }
};
