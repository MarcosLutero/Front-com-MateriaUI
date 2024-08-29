import React, { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, IconButton, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Request from '../Request';
import { AppContext } from '../../context';

interface Row {
  [key: string]: any;
}

interface DatatableProps {
  url: string;
  filter?: any;
  getQuery?: (payload: any) => any;
  getHeaders?: () => Map<string, string>;
  onError?: (err: any, res: any) => void;
  onUpdate?: (data: any) => void;
  onAction?: (action: any, update: () => void) => void;
  onClickAdd?: (update: () => void) => void;
}

const Datatable: React.FC<DatatableProps> = (props) => {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [order, setOrderState] = useState<string | undefined>(undefined);
  const [dir, setDir] = useState<'asc' | 'desc' | undefined>(undefined);
  const [filter, setFilterState] = useState<string>("");
  const [limit, setLimitState] = useState<number>(10);
  const [count, setCount] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);

  const context = useContext(AppContext);

  useEffect(() => {
    update();
  }, [filter, limit, offset, order, dir, props.url]);

  const update = () => {
    if (props.url) {
      let payload = {
        ...(props.filter ?? {}),
        filter,
        limit,
        offset: limit > 0 ? offset : 0,
        order,
        dir,
      };

      if (props.getQuery) {
        payload = props.getQuery(payload);
      }

      const token = context.token ?? "";

      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        Accept: 'json',
      };

      if (props.getHeaders) {
        props.getHeaders().forEach((value, key) => {
          headers[key] = value;
        });
      }

      Request('GET', props.url, token)
        .query(payload)
        .set(headers)
        .end((err, res) => {
          if (err && props.onError) {
            props.onError(err, res);
          } else if (!err) {
            const data = {
              headers: res.body.headers,
              rows: res.body.rows,
              count: res.body.count,
            };
            setHeaders(data.headers);
            setRows(data.rows);
            setCount(data.count);

            if (props.onUpdate) {
              props.onUpdate(data);
            }
          }
        });
    }
  };

  const handleSetOrder = (newOrder: string) => {
    if (newOrder === order) {
      if (dir === 'asc') {
        setDir('desc');
        setOffset(0);
      } else {
        setOrderState(undefined);
        setDir(undefined);
        setOffset(0);
      }
    } else {
      setOrderState(newOrder);
      setDir('asc');
      setOffset(0);
    }
  };

  const handleSetFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState(event.target.value);
    setOffset(0);
    setTimeout(() => update(), 400);
  };

  const handleSetPage = (event: unknown, newPage: number) => {
    setOffset(newPage * limit);
  };

  const handleSetRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimitState(parseInt(event.target.value, 10));
    setOffset(0);
  };

  const handleAction = (action: any) => {
    if (props.onAction) {
      props.onAction(action, () => update());
    }
  };

  const handleClickAdd = () => {
    if (props.onClickAdd) {
      props.onClickAdd(() => update());
    }
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index} onClick={() => handleSetOrder(header)}>
                  {header}
                  {order === header ? (dir === 'asc' ? ' ↑' : ' ↓') : ''}
                </TableCell>
              ))}
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((header, index) => (
                  <TableCell key={index}>{row[header]}</TableCell>
                ))}
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleAction({ name: 'edit', id: row.id })}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton onClick={() => handleAction({ name: 'delete', id: row.id })}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={count}
        page={offset / limit}
        onPageChange={handleSetPage}
        rowsPerPage={limit}
        onRowsPerPageChange={handleSetRowsPerPage}
      />
    </Paper>
  );
};

export default Datatable;
