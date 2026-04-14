import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from "@mui/material";
import { defaultStandingsColumns, defaultStandingsRows } from "../utils/Consts";
import { mapStandings } from "../utils/Utils";

export const LeagueStandings = (leagueStandings: any) => {

    if (leagueStandings.standings.hasOwnProperty("originalLeagueRankings")) {
        const { originalLeagueRankings } = leagueStandings.standings

        if (originalLeagueRankings.length > 0) {
            const columns = defaultStandingsColumns;
            const rows = mapStandings(originalLeagueRankings)
            return (
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
                    <DataGrid
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
