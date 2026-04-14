export const mapStandings = (standings) => {
    return standings.map((team, index) => {
        return {
            id: index + 1,
            team: team.teamName,
            points: team.originalPoints,
            pointsPercentage: team.originalPointsPercentage,
            regulationWins: team.originalRegulationWins,
            regulationAndOvertimeWins: team.originalRegulationAndOvertimeWins,
            totalWins: team.originalTotalWins
        }
    })
} 