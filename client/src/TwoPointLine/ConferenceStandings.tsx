import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Grid, Typography } from "@mui/material";
import { defaultStandingsColumns, defaultStandingsRows } from "../utils/Consts";
import { mapStandings } from "../utils/Utils";

export const ConferenceStandings = (leagueStandings: any) => {
    console.log(leagueStandings);

    if (leagueStandings.standings.hasOwnProperty("originalConferenceRankings")) {
        const { originalConferenceRankings } = leagueStandings.standings

        if (originalConferenceRankings.eastern.length > 0) {
            const columns = defaultStandingsColumns;
            const easternRows = mapStandings(originalConferenceRankings.eastern)
            const westernRows = mapStandings(originalConferenceRankings.western)
            return (
                <Grid container spacing={1} width={"auto"} >
                    <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                        <Typography>Western Conference</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={westernRows}
                                columns={columns}
                                initialState={{
                                }}
                                hideFooter
                                disableRowSelectionOnClick
                            />
                        </ Box>
                    </Grid>
                    <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                        <Typography>Eastern Conference</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={easternRows}
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
                        <Typography>Western Conference</Typography>
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
                            <Typography>Eastern Conference</Typography>
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
