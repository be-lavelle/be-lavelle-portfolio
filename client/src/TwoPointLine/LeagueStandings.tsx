import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from "@mui/material";
import { defaultStandingsColumns, defaultStandingsRows } from "../utils/Consts";
import { mapStandings } from "../utils/Utils";
import { StandingsProps } from "../utils/Types";

export const LeagueStandings: React.FC<StandingsProps> = ({ standings, loading }) => {
    if (!standings) {
        return null
    }
    if (standings.hasOwnProperty("originalLeagueRankings")) {
        const { originalLeagueRankings } = standings

        if (originalLeagueRankings.length > 0) {
            const columns = defaultStandingsColumns;
            const rows = mapStandings(originalLeagueRankings)
            return (
                <Box sx={{ height: 400, width: '100%' }}>
                    <Typography variant="h5" sx={{ marginTop: 2, justifyContent: "center", display: "flex" }}>League Standings</Typography>
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
            );
        } else {
            const columns = defaultStandingsColumns;
            const rows = defaultStandingsRows;

            return (
                <Box sx={{
                    width: '100%', '& .data-grid-header': {
                        fontWeight: 'bolder'
                    }
                }}>
                    <Typography variant="h5" sx={{ marginTop: 2, justifyContent: "center", display: "flex" }}>League Standings</Typography>
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
            );
        }
    }


};
