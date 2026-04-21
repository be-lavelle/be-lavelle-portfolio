import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Grid, Typography } from "@mui/material";
import { defaultStandingsColumns, defaultStandingsRows } from "../utils/Consts";
import { isInPlayoffs, mapStandings } from "../utils/Utils";
import { StandingsProps } from "../utils/Types";
import { playoffTeamRowStyling, standingsTitle } from "../utils/StylingConsts";


export const DivisionStandings: React.FC<StandingsProps> = ({ standings, loading }) => {
    console.log(standings);
    if (!standings) {
        return null
    }
    if (standings.hasOwnProperty("originalDivisionRankings")) {
        const { originalDivisionRankings } = standings

        if (originalDivisionRankings.pacific.length > 0) {
            const columns = defaultStandingsColumns;

            const pacificRows = mapStandings(originalDivisionRankings.pacific)
            const centralRows = mapStandings(originalDivisionRankings.central)
            const atlanticRows = mapStandings(originalDivisionRankings.atlantic)
            const metropolitanRows = mapStandings(originalDivisionRankings.metropolitan)

            return (
                <Grid container spacing={1} width={"auto"} >
                    <Grid size={{ sm: 12, md: 6, lg: 6 }} order={{ xs: 1, md: 1 }}>
                        <Typography variant="h5" sx={standingsTitle}>Pacific Division</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                loading={loading}
                                rows={pacificRows}
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
                    <Grid size={{ sm: 12, md: 6, lg: 6 }} order={{ xs: 3, md: 2 }}>
                        <Typography variant="h5" sx={standingsTitle}>Atlantic Division</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                loading={loading}
                                rows={atlanticRows}
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
                    <Grid size={{ sm: 12, md: 6, lg: 6 }} order={{ xs: 2, md: 3 }}>
                        <Typography variant="h5" sx={standingsTitle}>Central Division</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                loading={loading}
                                rows={centralRows}
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
                    <Grid size={{ sm: 12, md: 6, lg: 6 }} order={{ xs: 4, md: 4 }}>
                        <Typography variant="h5" sx={standingsTitle}>Metropolitan Division</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                loading={loading}
                                rows={metropolitanRows}
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

            );
        } else {
            const columns = defaultStandingsColumns;
            const rows = defaultStandingsRows
            return (
                <Grid container spacing={1} width={"auto"} >
                    <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                        <Typography>Pacific Division</Typography>
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
                            <Typography>Atlantic Division</Typography>
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
                        <Typography>Central Division</Typography>
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
                            <Typography>Metropolitan Division</Typography>
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
