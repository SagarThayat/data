import React, { useState } from "react";

export interface Column<T> {
    header: string;
    accessor: keyof T;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    selectable?: boolean;
    onRowSelect?: (selectedRows: T[]) => void;
}

export function DataTable<T extends { id: number | string }>({
    data,
    columns,
    loading = false,
    selectable = false,
    onRowSelect,
}: DataTableProps<T>) {
    const [selected, setSelected] = useState<T[]>([]);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T;
        direction: "asc" | "desc";
    } | null>(null);

    // Sorting logic
    const sortedData = React.useMemo(() => {
        if (!sortConfig) return data;
        return [...data].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [data, sortConfig]);

    const toggleSort = (key: keyof T) => {
        setSortConfig((prev) => {
            if (prev && prev.key === key && prev.direction === "asc") {
                return { key, direction: "desc" };
            }
            return { key, direction: "asc" };
        });
    };

    const handleSelect = (row: T) => {
        let updated: T[];
        if (selected.includes(row)) {
            updated = selected.filter((r) => r !== row);
        } else {
            updated = [...selected, row];
        }
        setSelected(updated);
        onRowSelect?.(updated);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (data.length === 0) {
        return <p>No data available</p>;
    }

    return (
        <table border={1} cellPadding={5}>
            <thead>
                <tr>
                    {selectable && <th>Select</th>}
                    {columns.map((col) => (
                        <th
                            key={String(col.accessor)}
                            style={{ cursor: "pointer" }}
                            onClick={() => toggleSort(col.accessor)}
                        >
                            {col.header}
                            {sortConfig?.key === col.accessor
                                ? sortConfig.direction === "asc"
                                    ? " 🔼"
                                    : " 🔽"
                                : ""}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedData.map((row) => (
                    <tr key={row.id}>
                        {selectable && (
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selected.includes(row)}
                                    onChange={() => handleSelect(row)}
                                />
                            </td>
                        )}
                        {columns.map((col) => (
                            <td key={String(col.accessor)}>{String(row[col.accessor])}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
