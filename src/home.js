import React from "react";
import { Link } from "react-router-dom";
import Videobox from "./videobox";
import Form from "./form";
import fire from "./fire";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      selected: null,
      popup: false,
      formBox: false,
      loading: true
    };
  }
  fetchData() {
    let iData = [];
    let initialData = fire.firestore();
    initialData.settings({
      timestampsInSnapshots: true
    });
    initialData.collection("data")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(item => {
          const detail = item.data();
          const id = item.id;
          iData.push({id, ...detail});

        })  
        let data = iData.filter(item => {
          if (item.page_type === '1') return item;
        });
    
        this.setState({ data, loading: false });
      })      
  }
  handleForm(e) {
    e.preventDefault();

    this.setState({
      formBox: true
    });
  }
  handlePopup(e) {
    let selected = e.currentTarget.getAttribute("data-src");

    this.setState({
      selected,
      popup: true
    });
  }
  closePopup(e) {
    e.preventDefault();
    this.setState({
      popup: false,
      formBox: false
    });
  }
  componentDidMount() {
    this.fetchData();
  }
  render() {
    const { data, selected, popup, formBox, loading } = this.state;
    return (
      <div className="pageWrapper">
        {loading && <div className="loading"><i></i></div>}
        <section>
          <div className="listContainer">
            <h2>
              <span>Kategorien</span>
              <small> {data.length} Videos</small>
            </h2>
            <ul>
              {data &&
                data.map((item, index) => (
                  <li
                    key={index}
                    data-src={item.video_url}
                    onClick={this.handlePopup.bind(this)}
                  >
                    <figure>
                      <img src={item.poster_image} />
                    </figure>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </li>
                ))}
            </ul>
          </div>
        </section>
        <aside>
          <Link className="kinder" to="/kinderfilme">
            <span>Kinderfilme</span>
          </Link>
          <a href="#" onClick={this.handleForm.bind(this)} className="linkIcon">
            <i className="iconForm" />
            <span>Feedback</span>
          </a>
        </aside>
        {popup && (
          <Videobox src={selected} close={this.closePopup.bind(this)} />
        )}
        {formBox && <Form close={this.closePopup.bind(this)} />}
      </div>
    );
  }
}

export default Home;
