import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Grid, Typography } from "@mui/material";
import { defaultStandingsColumns, defaultStandingsRows } from "../utils/Consts";
import { isInPlayoffs, mapStandings } from "../utils/Utils";
import { StandingsProps } from "../utils/Types";
import { playoffTeamRowStyling, standingsTitle } from "../utils/StylingConsts";


export const WildcardStandings: React.FC<StandingsProps> = ({ standings, loading }) => {
    console.log(standings);
    if (!standings) {
        return null
    }
    if (standings.hasOwnProperty("originalWildcardStandings")) {
        const { originalWildcardStandings } = standings

        if (originalWildcardStandings.top3Pacific.length > 0) {
            const columns = defaultStandingsColumns;

            const top3PacificRows = mapStandings(originalWildcardStandings.top3Pacific)
            const top3CentralRows = mapStandings(originalWildcardStandings.top3Central)
            const westWildcardsRows = mapStandings(originalWildcardStandings.westWildcards)
            const restOfWestRows = mapStandings(originalWildcardStandings.restOfWest)
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


            const top3AtlanticRows = mapStandings(originalWildcardStandings.top3Atlantic)
            const top3MetropolitanRows = mapStandings(originalWildcardStandings.top3Metropolitan)
            const eastWildcardsRows = mapStandings(originalWildcardStandings.eastWildcards)
            const restOfEastRows = mapStandings(originalWildcardStandings.restOfEast)
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
                <Box>
                    <Grid container spacing={1} width={"auto"} >
                        <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                            <Typography variant="h5" sx={standingsTitle}>Western Wildcard Standings</Typography>
                            <Box sx={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    loading={loading}
                                    rows={allWest}
                                    columns={columns}
                                    initialState={{
                                    }}
                                    hideFooter
                                    disableRowSelectionOnClick
                                    getRowClassName={(params) => { return isInPlayoffs(params.row.team, standings) }}
                                    sx={playoffTeamRowStyling}
                                />
                            </ Box>
                        </Grid>
                        <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                            <Typography variant="h5" sx={standingsTitle}>Eastern Wildcard Standings</Typography>
                            <Box sx={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    loading={loading}
                                    rows={allEast}
                                    columns={columns}
                                    initialState={{
                                    }}
                                    hideFooter
                                    disableRowSelectionOnClick
                                    getRowClassName={(params) => { return isInPlayoffs(params.row.team, standings) }}
                                    sx={playoffTeamRowStyling}
                                />
                            </ Box>
                        </Grid>
                    </Grid>
                    <Typography sx={{ marginTop: 2, backgroundColor: "rgb(222, 255, 222)", fontFamily: "Faculty Glyphic" }}>Playoff Teams</Typography>

                    <Typography sx={{ backgroundColor: "rgb(255, 216, 224)", fontFamily: "Faculty Glyphic" }}>Non-Playoff Teams</Typography>

                </Box >
            );
        } else {
            const columns = defaultStandingsColumns;
            const rows = defaultStandingsRows
            return (
                <Box>
                    <Grid container spacing={1} width={"auto"} >
                        <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                            <Typography variant="h5" sx={standingsTitle}>Western Wildcard Standings</Typography>
                            <Box sx={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    loading={loading}
                                    rows={rows}
                                    columns={columns}
                                    initialState={{
                                    }}
                                    hideFooter
                                    disableRowSelectionOnClick
                                    getRowClassName={(params) => { return isInPlayoffs(params.row.team, standings) }}
                                />
                            </ Box>
                        </Grid>
                        <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                            <Box sx={{ height: 400, width: '100%' }}>
                                <Typography variant="h5" sx={standingsTitle}>Eastern Wildcard Standings</Typography>
                                <DataGrid
                                    loading={loading}
                                    rows={rows}
                                    columns={columns}
                                    initialState={{
                                    }}
                                    hideFooter
                                    disableRowSelectionOnClick
                                    getRowClassName={(params) => { return isInPlayoffs(params.row.team, standings) }}
                                />
                            </ Box>
                        </Grid>
                    </Grid>
                    <Typography sx={{ marginTop: 2, backgroundColor: "rgb(222, 255, 222)", fontFamily: "Faculty Glyphic" }}>Playoff Teams</Typography>

                    <Typography sx={{ backgroundColor: "rgb(255, 216, 224)", fontFamily: "Faculty Glyphic" }}>Non-Playoff Teams</Typography>

                </Box >
            );
        }
    }
};
