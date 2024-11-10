import Feed from '@components/Feed';


const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
<h1 className="head_text text-center">
    Check out this page
    <br className="max-md:hidden"/>
    <span className="blue_gradient text-center"> Blue text here</span>
    </h1>
    <p className="desc text-center">
       Check out this wonderful page
    </p>

    <Feed/>
        </section>
  )
}

export default Home