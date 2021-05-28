import bg from '../../asset/bg.jpg'

export const ImageBackground = (props) => {
    return (
        <div 
            style={{
                backgroundImage: `url(${bg})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                height: '100%',
                width: '100%',
                position: 'relative'
            }}
        >
            
            <div
                style={{
                    // position: 'absolute',
                    height: '100vh',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    WebkitBoxShadow: 'inset 0px -50px 50px 0px rgba(0,0,0,0.43)',       
                    boxShadow: 'inset 0px -50px 50px 0px rgba(0,0,0,0.83)'
                }} 
            >
                
                {props.children}
            </div>
        </div>
    )
}