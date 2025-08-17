import React, { useState, useEffect } from "react";
import { DataTable, Column } from "./components/Datatable";

interface User {
  id: number;
  name: string;
  email: string;
}

const columns: Column<User>[] = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
];

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate API call
    setTimeout(() => {
      setUsers([
        { id: 1, name: "Alice", email: "alice@mail.com" },
        { id: 2, name: "Bob", email: "bob@mail.com" },
        { id: 3, name: "Charlie", email: "charlie@mail.com" },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div>
      <h1>User Table</h1>
      <DataTable<User>
        data={users}
        columns={columns}
        loading={loading}
        selectable
        onRowSelect={(rows) => console.log("Selected:", rows)}
      />
    </div>
  );
};

export default App;
