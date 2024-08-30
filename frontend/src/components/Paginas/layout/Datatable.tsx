import React, { ChangeEvent } from "react";
import {
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Popover,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  List as ListIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  FastForward as FastForwardIcon,
  FastRewind as FastRewindIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";
import moment from "moment";
import Request from "superagent";
import { AppContext } from "../../context";
import { Action } from './Types';
interface Header {
  order?: string;
  title: string;
  inner?: boolean;
  nowrap?: boolean;
}

interface Row {
  actions: Action[];
  values: (string | string[])[];
}


interface DatatableProps {
  url?: string;
  filter?: Record<string, any> | string | undefined;
  getQuery?: (payload: Record<string, any>) => Record<string, any>;
  getHeaders?: () => Map<string, string>;
  onError?: (err: any, res: any) => void;
  onUpdate?: (data: { headers: Header[]; rows: Row[]; count: number }) => void;
  onAction?: (action: Action, callback: () => void) => void;
  onClickAdd?: (callback: () => void) => void;
  useAdd?: boolean;
}

interface DatatableState {
  headers: Header[];
  rows: Row[];
  order?: string;
  dir?: "ASC" | "DESC";
  filter: string;
  limit: number;
  offset: number;
  count: number;
  anchorEl: HTMLElement | null;
}

class Datatable extends React.Component<DatatableProps, DatatableState> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  timeout: NodeJS.Timeout | null = null;

  state: DatatableState = {
    headers: [],
    rows: [],
    order: undefined,
    dir: undefined,
    filter: "",
    limit: 10,
    offset: 0,
    count: 0,
    anchorEl: null,
  };

  setPopoverContent(key: number) {
    // Implemente aqui o que for necessário ou deixe vazio se não precisar de nada específico
  }

  componentDidMount() {
    this.update();
  }

  update() {
    if (this.props.url) {
      let payload: Record<string, any> = {
        ...(typeof this.props.filter === 'object' ? this.props.filter : {}), // Garante que seja um objeto
        filter: this.state.filter,
        limit: this.state.limit,
        offset: this.state.limit > 0 ? this.state.offset : 0,
        order: this.state.order,
        dir: this.state.dir,
      };

      if (this.props.getQuery) {
        payload = this.props.getQuery(payload);
      }

      const headers: Record<string, string | undefined> = {
        Authorization: this.context.token ? `Bearer ${this.context.token}` : undefined,
        Accept: "json",
      };

      if (this.props.getHeaders) {
        this.props.getHeaders().forEach((value, key) => {
          headers[key] = value;
        });
      }

      Request.get(this.props.url)
        .query(payload)
        .set(headers)
        .end((err, res) => {
          if (err && this.props.onError) {
            this.props.onError(err, res);
          } else if (!err) {
            const data = {
              headers: res.body.headers,
              rows: res.body.rows,
              count: res.body.count,
            };
            this.setState(data, () => {
              if (this.props.onUpdate) {
                this.props.onUpdate(data);
              }
            });
          }
        });
    }
  }

  setOrder(order: string) {
    const update = () => this.update();

    if (order === this.state.order) {
      if (this.state.dir === "ASC") {
        this.setState({ dir: "DESC", offset: 0 }, update);
      } else {
        this.setState({ order: undefined, dir: undefined, offset: 0 }, update);
      }
    } else {
      this.setState({ order: order, dir: "ASC", offset: 0 }, update);
    }
  }

  setFilter(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ filter: event.target.value, offset: 0 }, () => {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.update(), 400);
    });
  }

  setPage(page: number) {
    this.setState({ offset: (page - 1) * this.state.limit }, () => this.update());
  }

  setLimit(limit: number) {
    this.setState({ limit: limit, offset: 0 }, () => this.update());
  }

  onAction(action: Action) {
    if (this.props.onAction) {
      this.props.onAction(action, () => this.update());
    }
  }

  onClickAdd() {
    if (this.props.onClickAdd) {
      this.props.onClickAdd(() => this.update());
    }
  }

  render() {
    const headers = this.state.headers.map((header, key0) => {
      const icon =
        this.state.order === header.order && header.order ? (
          this.state.dir === "ASC" ? (
            <ArrowDownwardIcon fontSize="small" />
          ) : (
            <ArrowUpwardIcon fontSize="small" />
          )
        ) : null;
      return (
        <TableCell key={key0} style={{ cursor: "pointer" }} onClick={() => this.setOrder(header.order!)}>
          {icon} {header.title}
        </TableCell>
      );
    });

    if (headers.length > 0)
      headers.push(
        <TableCell key={headers.length} style={{ textAlign: "center", width: "1%" }}>
          Ações
        </TableCell>
      );

    const rows = this.state.rows.map((row, key1) => {
      const actions =
        row.actions.length > 0
          ? row.actions.map((action, key2) => {
            return (
              <Button
                key={key2}
                size="small"
                variant={action.variant}
                onClick={() => this.onAction(action)}
                startIcon={action.icon}
                style={{ marginLeft: "0.5rem" }}
              >
                {action.title}
              </Button>
            );
          })
          : "Sem Ações";

      const cols = row.values.map((value, key) => {
        if (Array.isArray(value)) {
          return (
            <TableCell key={key}>
              <IconButton
                size="small"
                onClick={(event) =>
                  this.setState({ anchorEl: event.currentTarget }, () => {
                    this.setPopoverContent(key);
                  })
                }
              >
                <ListIcon />
              </IconButton>
              <Popover
                open={Boolean(this.state.anchorEl)}
                anchorEl={this.state.anchorEl}
                onClose={() => this.setState({ anchorEl: null })}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Typography variant="h6">{this.state.headers[key].title}</Typography>
                <List>
                  {value.map((label, i) => (
                    <ListItem key={i}>{label}</ListItem>
                  ))}
                </List>
              </Popover>
            </TableCell>
          );
        } else {
          return (
            <TableCell
              key={key}
              style={{ whiteSpace: this.state.headers[key].nowrap ? "nowrap" : "break-word" }}
              dangerouslySetInnerHTML={
                this.state.headers[key].inner
                  ? { __html: value as string }
                  : undefined
              }
            >
              {/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.0{3}Z$/.test(value as string)
                ? moment(value).calendar()
                : value}
            </TableCell>
          );
        }
      });

      if (cols)
        cols.push(
          <TableCell style={{ whiteSpace: "nowrap", textAlign: "center" }} key={cols.length}>
            {actions}
          </TableCell>
        );

      return <TableRow key={key1}>{cols}</TableRow>;
    });

    const pages =
      this.state.count > 0 && this.state.limit > 0
        ? Math.ceil(this.state.count / this.state.limit)
        : 1;
    const page = this.state.limit > 0 ? Math.ceil(this.state.offset / this.state.limit) + 1 : 1;
    const max = 5;
    const half = Math.floor(max / 2);

    let start = page - half;
    let end = page + half;

    if (pages <= max) {
      start = 1;
      end = pages;
    } else if (page <= half + 1) {
      start = 1;
      end = max;
    } else if (end > pages) {
      start = pages - max + 1;
      end = pages;
    }

    const tools = (
      <div  style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {this.props.useAdd && (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => this.onClickAdd()}
            startIcon={<AddIcon style={{ color: 'green' }} />}
            style={{ borderColor: 'green', color: 'green', height: '40px' }}
          >
            Adicionar
          </Button>
        )}
        <TextField
          size="small"
          label="Pesquisa"
          variant="outlined"
          onChange={(event) => this.setFilter(event as ChangeEvent<HTMLInputElement>)}
          value={this.state.filter}
          style={{ marginLeft: 8, marginRight: 16, flex: 1, height: '40px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="body1" >
          <strong>Total:</strong> {this.state.count ?? 0} registros.
        </Typography>
        <FormControl size="small" variant="outlined" style={{ minWidth: 120, height: "40px" }}>
          <InputLabel id="limit-select-label">Registros</InputLabel>
          <Select
            labelId="limit-select-label"
            value={this.state.limit}
            onChange={(event) => this.setLimit(Number(event.target.value))}
            label="Registros"
          >
            <MenuItem value={10}>10 registros</MenuItem>
            <MenuItem value={20}>20 registros</MenuItem>
            <MenuItem value={50}>50 registros</MenuItem>
            <MenuItem value={100}>100 registros</MenuItem>
            <MenuItem value={0}>Todos os registros</MenuItem>
          </Select>
        </FormControl>
        <Pagination
          count={pages}
          page={page}
          onChange={(event, value) => this.setPage(value)}
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
          color="primary"
          size="small"

        />
      </div>
    );

    const body =
      rows.length > 0 ? (
        rows
      ) : (
        <TableRow>
          <TableCell colSpan={headers.length} style={{ textAlign: "center" }}>
            <strong>Nenhum registro encontrado</strong>
          </TableCell>
        </TableRow>
      );

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {tools}
        <div style={{ flexGrow: 1, overflow: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>{headers}</TableRow>
            </TableHead>
            <TableBody>{body}</TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

export default Datatable;
