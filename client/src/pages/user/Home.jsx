import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Carousel, Row, Col, Card, Typography, Button, Badge } from "antd";
import axios from "axios";
import ProductList from "../../components/user/ProductList";

const { Title, Text } = Typography;

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [offers, setOffers] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBanners();
    fetchOffers();
    fetchTrendingProducts();
    fetchLatestProducts();
    fetchCategories();
  }, []);

  const fetchBanners = async () => {
    const res = await axios.get("http://localhost:8000/banners");
    setBanners(res.data);
  };

  const fetchOffers = async () => {
    const res = await axios.get("http://localhost:8000/offers");
    setOffers(res.data.filter((offer) => offer.activeStatus));
  };

  const fetchTrendingProducts = async () => {
    const res = await axios.get("http://localhost:8000/products/trending");
    setTrendingProducts(res.data);
  };

  const fetchLatestProducts = async () => {
    const res = await axios.get("http://localhost:8000/products/latest");
    setLatestProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:8000/categories");
    setCategories(res.data);
  };

  const sliderBanners = banners.filter((b) => b.type === "slider");
  const promoBanners = banners.filter((b) => b.type !== "slider");

  return (
    <div>
      <BannerCarousel banners={sliderBanners} />
      <ExclusiveOffers offers={offers} />
      <Categories categories={categories} />

      <section className="mt-5 container">
        <Title level={4}>Trending Products</Title>
        <ProductList products={trendingProducts} />

        <Row gutter={[16, 16]} className="my-5">
          {promoBanners.map((banner, index) => (
            <Col xs={24} md={12} key={banner._id}>
              <Card
                cover={
                  <img alt={`Banner ${index + 1}`} src={banner.bannerImage} />
                }
                className="position-relative"
              >
                <Badge.Ribbon text={banner.label || "Special"} color="green">
                  <Title level={5}>{banner.heading || "Exclusive Deal"}</Title>
                  <Text>{banner.content || "Grab this offer now!"}</Text>
                  <div className="mt-3">
                    <Link to="/shop">
                      <Button type="primary">
                        {banner.buttonText || "Shop Now"}
                      </Button>
                    </Link>
                  </div>
                </Badge.Ribbon>
              </Card>
            </Col>
          ))}
        </Row>

        <Title level={4}>Latest Products</Title>
        <ProductList products={latestProducts} />
      </section>
    </div>
  );
};

const BannerCarousel = ({ banners }) => (
  <Carousel autoplay>
    {banners.map((banner) => (
      <div key={banner._id} style={{ position: "relative" }}>
        <img
          src={banner.bannerImage}
          alt={banner._id}
          style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            color: "#fff",
          }}
        >
          <Title level={2} style={{ color: "#fff" }}>
            {banner.heading || "Fresh Find"}
          </Title>
          <Text style={{ color: "#fff" }}>{banner.content}</Text>
          <div className="mt-3">
            <Link to="/shop">
              <Button type="primary">Explore</Button>
            </Link>
          </div>
        </div>
      </div>
    ))}
  </Carousel>
);

const ExclusiveOffers = ({ offers }) => (
  <div className="container mt-5">
    <Title level={3} className="text-center mb-4">
      Exclusive Offers
    </Title>
    <Row gutter={[16, 16]}>
      {offers.map((offer) => (
        <Col xs={24} md={12} key={offer._id}>
          <Card bordered hoverable>
            <Title level={4} style={{ color: "green" }}>
              {offer.discount}% Discount
            </Title>
            <Text>On orders above ₹{offer.minimumOrder}</Text>
            <div className="mt-2">
              <Badge
                count={offer.offerCode}
                style={{ backgroundColor: "#52c41a" }}
              />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

const Categories = ({ categories }) => (
  <div className="container mt-4">
    <Row justify="center" gutter={[16, 16]}>
      {categories.map((category) => (
        <Col xs={6} sm={4} md={2} key={category._id} className="text-center">
          <img
            src={category.image}
            alt={category.name}
            className="img-fluid rounded-circle mb-2"
            style={{ height: "80px", width: "80px", objectFit: "cover" }}
          />
          <Text>{category.name}</Text>
        </Col>
      ))}
    </Row>
  </div>
);

export default Home;
