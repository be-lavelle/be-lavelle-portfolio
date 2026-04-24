import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Grid, Typography } from "@mui/material";
import { defaultStandingsColumns, defaultStandingsRows } from "../utils/Consts";
import { isInPlayoffs, mapStandings } from "../utils/Utils";
import { StandingsProps } from "../utils/Types";
import { playoffTeamRowStyling, standingsTitle } from "../utils/StylingConsts";

export const ConferenceStandings: React.FC<StandingsProps> = ({ standings, loading }) => {
    console.log(standings);
    if (!standings) {
        return null
    }
    if (standings.hasOwnProperty("originalConferenceRankings")) {
        const { originalConferenceRankings } = standings

        if (originalConferenceRankings.eastern.length > 0) {
            const columns = defaultStandingsColumns;
            const easternRows = mapStandings(originalConferenceRankings.eastern)
            const westernRows = mapStandings(originalConferenceRankings.western)
            return (
                <Box>
                    <Grid container spacing={1} width={"auto"} >
                        <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                            <Typography variant="h5" sx={standingsTitle}>Western Conference</Typography>
                            <Box sx={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    loading={loading}
                                    rows={westernRows}
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
                            <Typography variant="h5" sx={standingsTitle}>Eastern Conference</Typography>
                            <Box sx={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    loading={loading}
                                    rows={easternRows}
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
                <Grid container spacing={1} width={"auto"} >
                    <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                        <Typography variant="h5" sx={standingsTitle}>Western Conference</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                loading={loading}
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
                            <Typography variant="h5" sx={standingsTitle}>Eastern Conference</Typography>
                            <DataGrid
                                loading={loading}
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
