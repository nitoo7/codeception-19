import React, { Component } from 'react';
import Data from './list.json';
import './App.css';
import { relative } from 'path';

const basePath = 'https://hack-proxy-19.herokuapp.com';
// const basePath = 'http://192.168.0.101:3000';

export default class App extends Component {

  state = {
    originalList: Data,
    products: Data,
    status: "All"
  }

  componentDidMount() {
    const { products, originalList } = this.state;

    setInterval(() => { 
      fetch(`${basePath}/status`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      let modifeiedProducts = products.map(product => {
        if(product.id === 3 && product.status !== data.status) {
          this.triggerToast();
          product.status = data.status;
        }
        return product;
      })
      let modifeiedList = originalList.map(product => {
        if(product.id === 3) {
          product.status = data.status;
        }
        return product;
      })
      this.setState({
        products: modifeiedProducts,
        originalList: modifeiedList
      })
    })

     }, 5000);
     console.log('test')
  }

  changeFilter = (status) => {
    let filtered;
    if(status === "All") {
      filtered = this.state.originalList;
    } else {
      filtered = this.state.originalList.filter(product => {
        return product.status === status
      })
    }

    this.setState({
      status: status,
      products: filtered
    })
  }

  triggerToast = () => {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

  changeStatus = (id, status) => {
    const modifiedProducts = this.state.products.filter((product) => {
      if(product.id === id) {
        product.status = status;
        if(this.state.status != "All") {
          return false;
        }
      }
      return true
    })
    const modifiedOriginalList = this.state.originalList.map((product) => {
      if(product.id === id) {
        product.status = status;
      }
      return product;
    })

    this.setState({
      products: modifiedProducts,
      originalList: modifiedOriginalList
    })
    fetch(`${basePath}/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
      body: JSON.stringify({"status": "Ordered"})
    }).then(response => response.json()).then((res)=> {
    })
    this.triggerToast();
  }

  render() {
    const { products, status } = this.state;
    const outOfStockCount = products.filter(product => product.status === "OutOfStock").length;

    return (
      <div className="app">
        <header className="appHeader">
          <div className="appTitle">
            <span>Home Inventory</span>
            <button className="orderOnline">
              Order Online
              {outOfStockCount > 0 && <span>{outOfStockCount}</span>}
            </button>
          </div>
          <div className="appFilter">
            <div>
              <span onClick={() => { this.changeFilter("All")}} className={status === "All" ? "active" : ""}>All</span>
            </div>
            <div>
              <span onClick={() => { this.changeFilter("InStock")}} className={status === "InStock" ? "active inStock" : ""}>In Stock</span>
            </div>
            <div>
              <span onClick={() => { this.changeFilter("OutOfStock")}} className={status === "OutOfStock" ? "active outOfStock" : ""}>Out of Stock</span>
            </div>
            <div>
              <span onClick={() => { this.changeFilter("Ordered")}} className={status === "Ordered" ? "active ordered" : ""}>Ordered</span>
            </div>
          </div>
        </header>
        <div className="appBody">
          {/* <button onClick={this.triggerToast}>Show Snackbar</button> */}
          <div id="snackbar">Sugar stock status updated</div>
          {
            products.map(product => {
              return (
                <div style={{position: "relative"}}>
                  <div style={{"opacity": product.status === "OutOfStock" ? "0.4" : "1"}} className="productCard">
                    <div className="productImage">
                      <img src={product.img} />
                    </div>
                    <div className="productName">
                      {product.name}
                    </div>
                    <div className="productStatus">
                      {
                        product.status === "InStock" &&
                        <span className="inStockStatus">In Stock</span>
                      }
                      {
                        product.status === "Ordered" &&
                        <span className="orderedStatus">Ordered</span>
                      }
                    </div>
                  </div>
                  {
                    product.status === "OutOfStock" &&
                    <span onClick={() => {this.changeStatus(product.id, "Ordered")}} className="outOfStockStatus">Order online</span>
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
