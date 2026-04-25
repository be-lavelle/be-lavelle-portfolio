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
    const { originalWildcardStandings } = standings
    let eliminatedFromPlayoffs = false
    originalWildcardStandings.restOfWest.forEach((t: any) => {
        if (t.teamName === team) {
            eliminatedFromPlayoffs = true
        }
    })
    originalWildcardStandings.restOfEast.forEach((t: any) => {
        if (t.teamName === team) {
            eliminatedFromPlayoffs = true
        }
    })
    return eliminatedFromPlayoffs ? "non-playoff-team" : "playoff-team"
}