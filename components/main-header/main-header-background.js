import classes from "./main-headaer-background.module.css";

export default function MainHeaderBackground() {
  return (
    <div className={classes["header-background"]}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <defs>
          <linearGradient
            id="modernGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#a18cd1" stopOpacity="1" />
            <stop offset="100%" stopColor="#fbc2eb" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          fill="url(#modernGradient)"
          fillOpacity="1"
          d="M0,64L48,96C96,128,192,192,288,192C384,192,480,128,576,96C672,64,768,64,864,101.3C960,139,1056,213,1152,213.3C1248,213,1344,139,1392,101.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>
    </div>
  );
}
