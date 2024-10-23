import PropTypes from 'prop-types';

const Post = ({ name, image, description }) => {
    return (
        <div className="card w-full h-64 bg-base-100 shadow-xl mb-4">
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                {image && <figure><img src={image} alt="Post" className="w-full h-auto" /></figure>}
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