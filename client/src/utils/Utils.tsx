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

export function isInPlayoffs(team: string, standings: any): string {
    const { originalWildcardRankings } = standings
    let eliminatedFromPlayoffs = false
    originalWildcardRankings.restOfWest.forEach((t: any) => {
        if (t.teamName === team) {
            eliminatedFromPlayoffs = true
        }
    })
    originalWildcardRankings.restOfEast.forEach((t: any) => {
        if (t.teamName === team) {
            eliminatedFromPlayoffs = true
        }
    })
    return eliminatedFromPlayoffs ? "non-playoff-team" : "playoff-team"
}