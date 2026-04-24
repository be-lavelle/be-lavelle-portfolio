import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from "@mui/material";
import { defaultStandingsColumns, defaultStandingsRows } from "../utils/Consts";
import { isInPlayoffs, mapStandings } from "../utils/Utils";
import { StandingsProps } from "../utils/Types";
import { playoffTeamRowStyling, standingsTitle } from "../utils/StylingConsts";

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
                    <Typography variant="h5" sx={standingsTitle}>League Standings</Typography>
                    <DataGrid
                        loading={loading}
                        rows={rows}
                        columns={columns}
                        initialState={{
                        }}
                        hideFooter
                        disableRowSelectionOnClick
                        getRowClassName={(params) => { return isInPlayoffs(params.row.team, standings) }}
                        sx={playoffTeamRowStyling}
                    />
                    <Typography sx={{ marginTop: 2, backgroundColor: "rgb(222, 255, 222)", fontFamily: "Faculty Glyphic" }}>Playoff Teams</Typography>

                    <Typography sx={{ backgroundColor: "rgb(255, 216, 224)", fontFamily: "Faculty Glyphic" }}>Non-Playoff Teams</Typography>

                </ Box >
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
                    <Typography variant="h5" sx={standingsTitle}>League Standings</Typography>
                    <DataGrid
                        loading={loading}
                        rows={rows}
                        columns={columns}
                        initialState={{
                        }}
                        hideFooter
                        disableRowSelectionOnClick
                    />
                    <Typography sx={{ marginTop: 2, backgroundColor: "rgb(222, 255, 222)", fontFamily: "Faculty Glyphic" }}>Playoff Teams</Typography>

                    <Typography sx={{ backgroundColor: "rgb(255, 216, 224)", fontFamily: "Faculty Glyphic" }}>Non-Playoff Teams</Typography>

                </ Box >
            );
        }
    }


};
