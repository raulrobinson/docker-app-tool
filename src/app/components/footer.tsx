import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="text-white absolute bottom-0 left-0 w-full flex justify-center items-center z-20 pb-4">
            <div className="text-center flex items-center space-x-2">
                <p className="text-xs whitespace-nowrap">
                    Made with{' '}
                    <FontAwesomeIcon icon={faHeart} style={{ color: 'red', width: '1rem' }} className="mx-1" />
                    by
                </p>
                <p className="font-bold text-xs whitespace-nowrap">Raul Bolivar Navas</p>
                <p className="text-xs whitespace-nowrap">© {currentYear}</p>
            </div>
        </footer>
    );
}

export default Footer;
