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
        try {
            const uniqueHeadersSet = new Set();
            if (!data) {
                return;
            }
            uniqueHeadersSet.add(t('title'));
            data.forEach(place => {
                place.data.forEach(item => {
                    uniqueHeadersSet.add(item[0]);
                });
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

            const getArr = (placeItem, key) => {
                const item = placeItem.find(it => it[0] === key);
                return item;
            };

            data.forEach(it => {
                const row = [];
                const place = it.data;
                row.push(it.title);
                for (let i = 1; i < orderedKeysArray.length; i += 1) {
                    const key = orderedKeysArray[i];
                    const value = getArr(place, key)[1];
                    if (Array.isArray(value)) {
                        const str = value.join(', ');
                        row.push(str);
                        continue;
                    }
                    row.push(value);
                }
                rowsLocal.push(row);
            });
            setRows(rowsLocal);
        } catch (error) {
            console.log('AccessibilityTable: ', error);
        }
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