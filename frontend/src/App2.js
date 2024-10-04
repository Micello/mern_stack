import { useState } from "react";

function ProductCategoryRow({category}){
    return(
        <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
    );
}

function ProductRow({name, price, stocked}){
    let dispName = stocked ? name: <p style={{color: "red"}}>{name}</p>;
    return(
        <tr>
            <td>{dispName}</td>
            <td>{price}</td>
        </tr>
    )
}

function ProductTable({products, filterText, inStockOnly}){
    let rows=[]
    let lastCategory = null;
    
   
    products.forEach(product => {
        
        if (
            product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1
           ){return}
        
        if (inStockOnly){
            if (product.stocked === false){return}
        }
        
        if (product.category !== lastCategory){
            rows.push(<ProductCategoryRow category={product.category} />)
        }
        rows.push(<ProductRow name={product.name} price={product.price} stocked={product.stocked} />)
        lastCategory = product.category
    });
    return(
        <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
    )
}


function SearchBar({filterText, inStockOnly, onFilterTextChange, onInStockOnlyChange}){
    return(
        <form>
        <input 
          type="text" 
          value={filterText} // imposta che il prop value sia sempre uguale allo stato filterText, ma solo FilterableProductTable possiede lo stato e può modificare filtertext e instockonly, quindi dobbiam passare tali funzioni
          placeholder="Search..."
          onChange={(e) => onFilterTextChange(e.target.value)}
        />
        <label>
          <input 
            type="checkbox" 
            checked={inStockOnly} 
            onChange={(e) => onInStockOnlyChange(e.target.checked)} />
          {' '}
          Only show products in stock
        </label>
      </form>
    )
}

function FilterableProductTable({products}){
    const [filterText, setFilterText] = useState('')
    const [inStockOnly, setInStockOnly] = useState(false)
    return(
        <div>
            <SearchBar
                filterText={filterText}
                inStockOnly={inStockOnly}
                onFilterTextChange={setFilterText}
                onInStockOnlyChange={setInStockOnly} /> 
            <ProductTable 
                products={products}
                filterText={filterText}
                inStockOnly={inStockOnly}/>
        </div>
    );
}
const PRODUCTS = [
    {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
    {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
    {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
    {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
    {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
    {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
  ];


  export default function App2() {
    return <FilterableProductTable products={PRODUCTS} />;
  }