import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Grid, Typography } from "@mui/material";
import { defaultStandingsColumns, defaultStandingsRows } from "../utils/Consts";
import { mapStandings } from "../utils/Utils";


export const WildcardStandings = (leagueStandings: any) => {
    console.log(leagueStandings);

    if (leagueStandings.standings.hasOwnProperty("originalWildcardRankings")) {
        const { originalWildcardRankings } = leagueStandings.standings

        if (originalWildcardRankings.top3Pacific.length > 0) {
            const columns = defaultStandingsColumns;

            const top3PacificRows = mapStandings(originalWildcardRankings.top3Pacific)
            const top3CentralRows = mapStandings(originalWildcardRankings.top3Central)
            const westWildcardsRows = mapStandings(originalWildcardRankings.westWildcards)
            const restOfWestRows = mapStandings(originalWildcardRankings.restOfWest)
            const westPlayoffs = [...top3PacificRows, ...top3CentralRows].sort((a, b) => {
                return b.points - a.points
            })
            const allWest = [...westPlayoffs, ...westWildcardsRows, ...restOfWestRows].map((team, index) => {
                return {
                    id: index + 1,
                    team: team.team,
                    points: team.points,
                    pointsPercentage: team.pointsPercentage,
                    regulationWins: team.regulationWins,
                    regulationAndOvertimeWins: team.regulationAndOvertimeWins,
                    totalWins: team.totalWins
                }
            })

            console.log(allWest);


            const top3AtlanticRows = mapStandings(originalWildcardRankings.top3Atlantic)
            const top3MetropolitanRows = mapStandings(originalWildcardRankings.top3Metropolitan)
            const eastWildcardsRows = mapStandings(originalWildcardRankings.eastWildcards)
            const restOfEastRows = mapStandings(originalWildcardRankings.restOfEast)
            const eastPlayoffs = [...top3AtlanticRows, ...top3MetropolitanRows].sort((a, b) => {
                return b.points - a.points
            })
            const allEast = [...eastPlayoffs, ...eastWildcardsRows, ...restOfEastRows].map((team, index) => {
                return {
                    id: index + 1,
                    team: team.team,
                    points: team.points,
                    pointsPercentage: team.pointsPercentage,
                    regulationWins: team.regulationWins,
                    regulationAndOvertimeWins: team.regulationAndOvertimeWins,
                    totalWins: team.totalWins
                }
            })

            return (
                <Grid container spacing={1} width={"auto"} >
                    <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                        <Typography>Western Wildcards</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={allWest}
                                columns={columns}
                                initialState={{
                                }}
                                hideFooter
                                disableRowSelectionOnClick
                            />
                        </ Box>
                    </Grid>
                    <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                        <Typography>Atlantic Wildcard</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={allEast}
                                columns={columns}
                                initialState={{
                                }}
                                hideFooter
                                disableRowSelectionOnClick
                            />
                        </ Box>
                    </Grid>
                </Grid>

            );
        } else {
            const columns = defaultStandingsColumns;
            const rows = defaultStandingsRows
            return (
                <Grid container spacing={1} width={"auto"} >
                    <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                        <Typography>Western Wildcard</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{
                                }}
                                hideFooter
                                disableRowSelectionOnClick
                            />
                        </ Box>
                    </Grid>
                    <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <Typography>Eastern Wildcard</Typography>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{
                                }}
                                hideFooter
                                disableRowSelectionOnClick
                            />
                        </ Box>
                    </Grid>
                </Grid>
            );
        }
    }
};
