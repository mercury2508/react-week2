import axios from "axios";
import { useState } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;
import './App.css'

function App() {
  // 帳密狀態
  const [account, setAccount] = useState({
    username: "",
    password: ""
  });

  // 取得帳號密碼
  const getInputValue = (event) => {
    const { name, value } = event.target;
    setAccount({
      ...account,
      [name]: value,
    })
  }

  // 登入狀態，預設為尚登入(false)，以三元運算子控制顯示的頁面(停留在登入畫面)
  const [isAuth, setIsAuth] = useState(false);

  // 登入功能
  const loginButton = (event) => {
    event.preventDefault();
    (async () => {
      try {
        const res = await axios.post(`${baseUrl}/admin/signin`, account);
        const { token, expired } = res.data;
        document.cookie = `hexToken=${token}; expires=${new Date({ expired })}`;
        setIsAuth(true);
        axios.defaults.headers.common['Authorization'] = token;
        getProducts();
      } catch (error) {
        alert(error.response.data?.error?.message)
      }
    })()
  }

  // 取得產品
  const getProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/${apiPath}/admin/products`);
      setProducts(res.data.products);
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  // 產品細節狀態
  // 產品列表狀態
  const [tempProduct, setTempProduct] = useState({});
  const [products, setProducts] = useState([]);

  // 確認使用者是否已登入
  const checkUserLogin = async () => {
    try {
      await axios.post(`${baseUrl}/api/user/check`);
      alert("使用者已成功登入");
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  return (
    <>
      {isAuth ?
        <div className="container py-5">
          <div className="row">
            <div className="col-6">
              <button type="button" className="btn btn-success mb-3" onClick={checkUserLogin} >檢查使用者是否已登入</button>
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <th scope="row">{product.title}</th>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled ? <span style={{color: "green"}}>已啟用</span> : "未啟用 "}</td>
                      <td>
                        <button
                          onClick={() => setTempProduct(product)}
                          className="btn btn-primary"
                          type="button"
                        >
                          查看細節
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-6">
              <h2>單一產品細節</h2>
              {tempProduct.title ? (
                <div className="card">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top img-fluid"
                    alt={tempProduct.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge text-bg-primary">
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className="card-text">商品描述：{tempProduct.description}</p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <p className="card-text">
                      <del>{tempProduct.origin_price} 元</del> / {tempProduct.price}{" "}
                      元
                    </p>
                    <h5 className="card-title">更多圖片：</h5>
                    {tempProduct.imagesUrl?.map((image) => (image && (<img key={image} src={image} className="img-fluid" />)))}
                  </div>
                </div>
              ) : (
                <p>請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div> :
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">請先登入</h1>
          <form className="d-flex flex-column gap-3" onSubmit={loginButton} >
            <div className="form-floating mb-3">
              <input type="email" name="username" value={account.username} className="form-control" id="username" placeholder="name@example.com" onChange={getInputValue} />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input type="password" name="password" value={account.password} className="form-control" id="password" placeholder="Password" onChange={getInputValue} />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-primary">登入</button>
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      }
    </>
  )
}

export default App
