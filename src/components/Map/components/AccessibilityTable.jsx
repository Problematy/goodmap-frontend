import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Arrow from '@mui/icons-material/ArrowLeftRounded';
import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import { httpService } from '../../../services/http/httpService';

const AccessibilityTable = ({ userPosition, setIsAccessibilityTableOpen, allCheckboxes }) => {
    const { t } = useTranslation();

    const [data, setData] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        httpService
            .getLocationsWithLatLon(userPosition.lat, userPosition.lng, allCheckboxes)
            .then(places => {
                setData(places);
            });
    }, [allCheckboxes, userPosition]);

    useEffect(() => {
        const uniqueHeadersSet = new Set();
        if (!data) {
            return;
        }
        uniqueHeadersSet.add(t('title'));
        data.forEach(place => {
            Object.keys(place.data).forEach(key => uniqueHeadersSet.add(key));
        });
        const uniqueNumberedKeys = {};
        Array.from(uniqueHeadersSet).forEach((key, index) => {
            uniqueNumberedKeys[key] = index;
        });
        const orderedKeysArray = Object.keys(uniqueNumberedKeys).sort(
            (a, b) => uniqueNumberedKeys[a] - uniqueNumberedKeys[b],
        );
        setHeaders(orderedKeysArray);

        const rowsLocal = [];
        data.forEach(place => {
            const row = [];
            row.push(place.title);
            for (let i = 1; i < orderedKeysArray.length; i += 1) {
                let key = orderedKeysArray[i];
                const rowData = place.data[key];
                if (Array.isArray(rowData)) {
                    let str = rowData.join(', ');
                    row.push(str);
                    continue;
                }
                row.push(place.data[key]);
            }
            rowsLocal.push(row);
        });
        setRows(rowsLocal);
    }, [data]);

    return (
        <>
            <div>
                <IconButton>
                    <Arrow onClick={() => setIsAccessibilityTableOpen(false)} />
                </IconButton>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            {headers.map(header => (
                                <TableCell
                                    align="center"
                                    style={{
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow
                                key={row.toString()}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {row.map((cell, index) => (
                                    <TableCell key={cell} align="center">
                                        {cell}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

AccessibilityTable.propTypes = {
    userPosition: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
    }).isRequired,
    setIsAccessibilityTableOpen: PropTypes.func.isRequired,
    allCheckboxes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AccessibilityTable;
