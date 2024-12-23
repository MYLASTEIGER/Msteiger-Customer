import { useEffect, useState} from "react";
import {Customer} from './customer';
const uri = "http://localhost:5242/api/CustomerSupports"



const callUserList = async () => {
  const res = await fetch(uri);
  const customers = await res.json();
  console.debug("Customers:", customers);
  return customers;
};


function CustomerList() {
const  [customers, setCustomers ] = useState<Customer[]>([]);
const [newCustomer, setNewCustomer] = useState<Customer>({
  id: 0,
  name: '',
  phone: '',
  email: '',
  isActive: true
});
const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

useEffect(() => {
  callUserList()  .then(res => setCustomers(res));
  }, []);

const fetchCustomers = async () => {
    try {
      const res = await fetch(uri);
      const data = await res.json();
     setCustomers(data);
    } catch (error) {
      console.error('Error fetching Customers:', error);
    }
  };

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if(editingCustomer) {
    await updateCustomer(newCustomer);
  }else {
    await createCustomer(newCustomer);
  }
  setNewCustomer({
    id: 0,  
    name: '', 
    phone: '',
    email: '',
    isActive: true,
  });
  setEditingCustomer(null);
};


const updateCustomer = async (customer: Customer) => {
  const res = await fetch(`${uri}/${customer.id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json', },
    body: JSON.stringify(customer),
});
  if (res.ok){
    fetchCustomers();
  }
};
const createCustomer = async(customer: Customer) => {
  const res = await fetch(uri, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(customer),
  });
  if (res.ok){
    fetchCustomers();
  }
};

const deleteCustomer = async(id: number) => {
  const res = await fetch(`${uri}/${id}`,{
    method: 'DELETE',
  });
  if (res.ok){
  fetchCustomers();
}
};
const startEdit = (customer: Customer) => {
  setEditingCustomer(customer);
  setNewCustomer(customer);
};
const trs = customers.map(c => (
  <tr key={ c.id}>
      <td>{c.id}</td>
      <td>{c.name}</td>
      <td>{c.phone ?? "(null)"}</td>
      <td>{c.email ?? "(null)"}</td>
      <td>{c.isActive ? "Y" : "N"}</td>
        <button onClick={() => startEdit(c)}>Edit Info</button>
        <button onClick={() => deleteCustomer(c.id)}>deleteCustomer Info</button>
  </tr>
  ));
  

return (
  <>        
  <h2>Customer List</h2>
  <main>
    <table className="table table-sm">
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Admin?</th>
        </tr>
      </thead>
      <tbody>
        {trs}
      </tbody>
    </table>

    <h3>{editingCustomer ? 'Edit Customer': 'Add New Customer'}</h3>
        <form onSubmit={handleSubmit}>
        <input
        type="text"
        name="name"
        placeholder="Name"
        value={newCustomer.name}
        onChange={handleChange}
        required
        />
        <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={newCustomer.phone || ""} 
        onChange={handleChange}
        required
        />
        <input
        type="text"
        name="email"
        placeholder="Email"
        value={newCustomer.email || ""}
        onChange={handleChange}
        required
        />
        <label>
          Active:
        <input 
        type="checkbox"
        name="isActive"
        checked={newCustomer.isActive}
        onChange={()=> setNewCustomer((prev)=> ({
          ...prev,
          isActive: !prev.isActive,
        }))}
        />
        </label>
        <button type="submit">{editingCustomer ? 'Update' : 'Create'} Customer </button>
      </form>
    </main>
  </>
);
}

export default CustomerList;
