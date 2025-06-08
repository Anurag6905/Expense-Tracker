import { useEffect, useState, useRef } from 'react';
import '../CSS/Expense.css'
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {Chart as ChartJS,ArcElement,Tooltip,Legend,CategoryScale,LinearScale,BarElement,PointElement,LineElement,} from "chart.js";
ChartJS.register(ArcElement,Tooltip,Legend,CategoryScale,LinearScale,BarElement,PointElement,LineElement)
type Category ="Select-Category"| "Groceries"| "Transport"| "Shopping"| "Rent"| "Utilities"| "Health"| "Fitness"| "Subscriptions"| "Education"| "Travel"| "Dining Out"| "Entertainment"| "Gifts"| "Miscellaneous"| "Others";
import { motion, AnimatePresence } from 'framer-motion';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
}

const Expense = () => {

    const [title,SetTitle] = useState<string>("");
    const [amount,SetAmount] = useState<number>(0);
    const [category,SetCategory] = useState<Category>("Select-Category");
    const [date,SetDate] = useState<string>("");
    const [expenses, SetExpenses] = useState<Expense[]>([])
    const [filterCategory,SetfilterCategory] = useState<Category>("Select-Category")
    const [filterDate,SetfilterDate] = useState<string>("")

    const categories = expenses.reduce((acc: { [key: string]: number }, expense) => {
        if (expense.category !== "Select-Category") {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        }
        return acc;
    }, {});
      

    const lineChartData = {
        labels: expenses.map(e => e.date), // Or group by day/month if needed
        datasets: [
          {
            label: "Expenses Over Time",
            data: expenses.map(e => e.amount),
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1
          }
        ]
    };

    const barChartData = {
        labels: Object.keys(categories),
        datasets: [
          {
            label: "Expense by Category",
            data: Object.values(categories),
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1
          }
        ]
    };

    const doughnutChartData = {
        labels: Object.keys(categories),
        datasets: [
        {
            label: "Expense by Category",
            data: Object.values(categories),
            backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
            "#9966FF", "#FF9F40", "#FF6384", "#36A2EB",
            "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
            ],
            borderWidth: 1,
        },
        ],
    };

    const filterExpenses = expenses.filter((expense) => {
        const isCategoryMatch = filterCategory === 'Select-Category' || expense.category === filterCategory;
    
        const isDatematch = !filterDate || new Date(expense.date).toDateString() === new Date(filterDate).toDateString();
    
        return isCategoryMatch && isDatematch;
    });
    

    const handleAdd = () => {
        if(!title.trim() || amount<=0 || category === "Select-Category" || !date) {
            alert("Please fill all fields");
            return;
        }
        const newExpense: Expense = {
            id: Date.now().toString(),
            title,
            amount,
            category,
            date,
          };
        SetExpenses([...expenses,newExpense]);
    }

    const handleDelete = (id:string) => {
        SetExpenses(expenses.filter((expense) => expense.id !== id));
    }

    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    const isInitialLoad = useRef(true);

    useEffect(() => {
        const data = localStorage.getItem("expenses");
        console.log("Fetched from localStorage:", data);
        if (data) {
        SetExpenses(JSON.parse(data) as Expense[]);
        }
    }, []);

    useEffect(() => {
        if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
        }
        console.log("Saving to localStorage:", expenses);
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }, [expenses]);
      
    return(

        <div className='Main-App'>  
            <h1 className='Heading'>Expense Tracker</h1>

            <p className='info'>Add your Expense</p>
            <div className="Input-Container">
                <input type='text' placeholder='Enter Title' className='title' value={title} onChange={(e)=>SetTitle(e.target.value)} required/>
                <input type='number' placeholder='Amount (₹)' className='amount' value={amount} onChange={(e)=>SetAmount(Number(e.target.value))} required/>
                <select value={category} className="Category-bar" onChange={(e)=>SetCategory(e.target.value as Category)} required>
                    <option className="Category" value="Select-Category">Select Category</option>
                    <option className="Category" value="Groceries">Groceries</option>
                    <option className="Category" value="Transport">Transport</option>
                    <option className="Category" value="Shopping">Shopping</option>
                    <option className="Category" value="Rent">Rent</option>
                    <option className="Category" value="Utilities">Utilities</option>
                    <option className="Category" value="Health">Health</option>
                    <option className="Category" value="Fitness">Fitness</option>
                    <option className="Category" value="Subscriptions">Subscriptions</option>
                    <option className="Category" value="Education">Education</option>
                    <option className="Category" value="Travel">Travel</option>
                    <option className="Category" value="Dining Out">Dining Out</option>
                    <option className="Category" value="Entertainment">Entertainment</option>
                    <option className="Category" value="Gifts">Gifts</option>
                    <option className="Category" value="Miscellaneous">Miscellaneous</option>
                    <option className="Category" value="Others">Others</option>
                </select>
                <input type='date' className='Date' value={date} onChange={(e)=>SetDate(e.target.value)}/>
                <button className='Add' onClick={handleAdd}>Add</button>
            </div>

            <p className='Heading2'>Expense List</p>

            <div className="Filter-Container">
                <select value={filterCategory} className="Category-bar" onChange={(e)=>SetfilterCategory(e.target.value as Category)}>
                <option className="Category" value="Select-Category">Select Category</option>
                    <option className="Category" value="Groceries">Groceries</option>
                    <option className="Category" value="Transport">Transport</option>
                    <option className="Category" value="Shopping">Shopping</option>
                    <option className="Category" value="Rent">Rent</option>
                    <option className="Category" value="Utilities">Utilities</option>
                    <option className="Category" value="Health">Health</option>
                    <option className="Category" value="Fitness">Fitness</option>
                    <option className="Category" value="Subscriptions">Subscriptions</option>
                    <option className="Category" value="Education">Education</option>
                    <option className="Category" value="Travel">Travel</option>
                    <option className="Category" value="Dining Out">Dining Out</option>
                    <option className="Category" value="Entertainment">Entertainment</option>
                    <option className="Category" value="Gifts">Gifts</option>
                    <option className="Category" value="Miscellaneous">Miscellaneous</option>
                    <option className="Category" value="Others">Others</option>
                </select>

                <input type='date' className='Date' value={filterDate} onChange={(e)=>SetfilterDate(e.target.value)}/>
            </div>

            <div className="Display-Container">
                <AnimatePresence>
                    {filterExpenses.map((expense) => (
                    <motion.div
                        className="expense-card"
                        key={expense.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className='expense-title'>{expense.title}</p>
                        <p className='expense-amount'>₹ {expense.amount}</p>
                        <p className='expense-category'>{expense.category}</p>
                        <p className='expense-date'>{expense.date}</p>
                        <div className="Delete-div"><button className='Delete' onClick={() => handleDelete(expense.id)}>Delete</button></div>
                        
                    </motion.div>
                    ))}
                </AnimatePresence>
            </div>


            <p className='Total-Amount'>Total Amount : <span className='white'>₹ {totalAmount}</span></p>

            <p className='Heading3'>Data Analysis</p>

            <div className="Data-Container">
                <div className="chart-box"><Doughnut data={doughnutChartData} /></div>
                <div className="chart-box"><Bar data={barChartData} /></div>
                <div className="chart-boxes"><Line data={lineChartData} /></div>
            </div>

        </div>
    )
}

export default Expense;