import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Grid, Typography } from "@mui/material";
import { defaultStandingsColumns, defaultStandingsRows } from "../utils/Consts";
import { mapStandings } from "../utils/Utils";
import { StandingsProps } from "../utils/Types";


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
                    <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                        <Typography variant="h5" sx={{ marginTop: 2, justifyContent: "center", display: "flex" }}>Pacific Division</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                loading={loading}
                                rows={pacificRows}
                                columns={columns}
                                initialState={{
                                }}
                                hideFooter
                                disableRowSelectionOnClick
                            />
                        </ Box>
                    </Grid>
                    <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                        <Typography variant="h5" sx={{ marginTop: 2, justifyContent: "center", display: "flex" }}>Atlantic Division</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                loading={loading}
                                rows={atlanticRows}
                                columns={columns}
                                initialState={{
                                }}
                                hideFooter
                                disableRowSelectionOnClick
                            />
                        </ Box>
                    </Grid>
                    <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                        <Typography variant="h5" sx={{ marginTop: 2, justifyContent: "center", display: "flex" }}>Central Division</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                loading={loading}
                                rows={centralRows}
                                columns={columns}
                                initialState={{
                                }}
                                hideFooter
                                disableRowSelectionOnClick
                            />
                        </ Box>
                    </Grid>
                    <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                        <Typography variant="h5" sx={{ marginTop: 2, justifyContent: "center", display: "flex" }}>Metropolitan Division</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                loading={loading}
                                rows={metropolitanRows}
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
