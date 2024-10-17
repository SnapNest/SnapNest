import PropTypes from 'prop-types';

const Post = ({ name, image, description }) => {
    return (
        <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                {image && <figure><img src={image} alt="Post" /></figure>}
                <p>{description}</p>
            </div>
        </div>
    );
};

Post.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    description: PropTypes.string.isRequired,
};

export default Post;