import Axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import "./App.css";
import { CartContext } from "./CartContext";

function App() {
  const [cart, setCart] = useContext(CartContext);
  const isFirstRun = useRef(true);
  useEffect(() => {
    
    if (isFirstRun.current) {
      window.scrollTo(0, 0);
      isFirstRun.current = false;
      debugger;
      if (cart.length === 0) {
        if (localStorage.getItem("cartItemsMIT")) {
          setCart(JSON.parse(localStorage.getItem("cartItemsMIT")));
        }
      }
      fetchProduct();
      return;
    }
  });
  const [product, setProduct] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);
  const [loadingState, setLoadingState] = useState(true);

  function fetchProduct() {
    setLoadingState(true);
    var apiBaseUrl = "https://fakestoreapi.com/products";
    Axios(apiBaseUrl, {
      method: "GET",
    })
      .then((res) => {
        console.log(res.data);
        setProduct(res.data);
        setLoadingState(false);
      })
      .catch((error) => {
        setErrorMsg(error);
        setLoadingState(false);
      });
  }

  function addToCart(id, title, price) {
    var productAlreadyInCard = false;

    const prd = {
      id: id,
      title: title,
      price: price,
      count: 1,
    };

    cart.forEach((item) => {
      if (item.id === prd.id) {
        productAlreadyInCard = true;
        item.count = parseInt(item.count) + 1;
        setCart((curr) => [...curr]);
        localStorage.setItem("cartItemsMIT", JSON.stringify(cart));
        document.getElementById("subtotal").innerHTML =
          "$" +
          Math.round(cart.reduce((a, c) => a + c.price * c.count, 0) * 100) /
            100;
      }
    });

    if (!productAlreadyInCard) {
      debugger;
      setCart((curr) => [...curr, prd]);
      localStorage.setItem("cartItemsMIT", JSON.stringify(cart));
    }
  }

  function RenderCartItems() {
    function addCartNumber(id, count) {
      const prd = {
        id: id,
        count: count,
      };

      cart.forEach((item) => {
        if (item.id === prd.id) {
          item.count = parseInt(count);

          document.getElementById("subtotal").innerHTML =
          
            "subtotal: $" +
            Math.round(cart.reduce((a, c) => a + c.price * c.count, 0) * 100) /
              100;
             
          localStorage.setItem("cartItemsMIT", JSON.stringify(cart));
        }
      });
    }

    var listItems = "";
    if (cart.length > 0) {
      listItems = cart.map((item) => (
        <tr key={item.id}>
         
          <td>
            <span className="pdt_title">
              {" "}
              <Title12 t12={item.title}></Title12>
            </span>
          </td>

          <td>
            <input
              id={"count" + item.id}
              min="0"
              // max="100"
              type="number"
              defaultValue={item.count}
              title="Qty"
              className="input-text qty"
              size="4"
              onClick={() =>
                addCartNumber(
                  item.id,
                  document.getElementById("count" + item.id).value === ""
                    ? 1
                    : document.getElementById("count" + item.id).value
                )
              }
              onChange={() =>
                addCartNumber(
                  item.id,
                  document.getElementById("count" + item.id).value === ""
                    ? 1
                    : document.getElementById("count" + item.id).value
                )
              }
            />
          </td>

          <td>
           { item.price}
          </td>

        
        </tr>
      ));

      return (
        <div className="row ">
         
            <table className="table_shop">
              <tbody>
                {listItems}

                <tr>
                  <td>
                    <h2 id="subtotal"> subtotal: ${Math.round(
                      cart.reduce((a, c) => a + c.price * c.count, 0) * 100
                    ) / 100}
                    </h2>
                    
                  </td>
                </tr>
              </tbody>
            </table>
         
         
        </div>
      );
    } else
      return (
        <div>
          <h5> cart has no Items</h5>
        </div>
      );
  }

  function Title12(props) {
    var n = props.t12.length;
    var t = props.t12;
    if (n > 12) {
      t = props.t12.substring(0, 12) + "...";
    }
    return <h2>{t}</h2>;
  }

  function Product(props) {
    const { product } = props;
    return (
      <div key={product.id} className="card">
        <div className="row card-body">
          <div>{product.id}</div>
          <Title12 t12={product.title}></Title12>
          <button
            className="right"
            onClick={() => addToCart(product.id, product.title, product.price)}
          >
            add to basket
          </button>
        </div>
      </div>
    );
  }

  if (loadingState === false) {
    if (errorMsg === false) {
      return (
        <div className="row top">
          <div className="col-2">
            {product.slice(0, 5).map((p) => (
              <Product key={p.id} product={p}></Product>
            ))}
          </div>
          <div className="col-2">
            <div className="card">
              <div className="card-body">
                <RenderCartItems></RenderCartItems>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row top">
          <p>{errorMsg}</p>
        </div>
      );
    }
  } else {
    return (
      <div className="row top">
        <div className="col-1">
          <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
          <p>Loading . . .</p>
        </div>
      </div>
    );
  }
}

export default App;
