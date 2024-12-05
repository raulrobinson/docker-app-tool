import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="text-white absolute bottom-0 left-0 w-full flex flex-col items-center z-20">
            <div className="text-center py-2 px-2 rounded-lg mx-2 my-2">
                <p className="flex items-center justify-center text-xs whitespace-nowrap">
                    Made with{' '}
                    <FontAwesomeIcon icon={faHeart} style={{ color: 'red', width: '1rem'}} className="mx-1" />
                    by
                </p>
                <p className="flex items-center font-bold justify-center text-xs whitespace-nowrap">Raul Bolivar Navas</p>
                <p className="flex items-center justify-center text-xs whitespace-nowrap">@ {currentYear}</p>
            </div>
        </footer>
    );
}

export default Footer;
