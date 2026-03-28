package tests;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;
import pages.LoginPage;

import java.time.Duration;

public class ValidLoginTest {
    private WebDriver driver;
    private LoginPage loginPage;

    @BeforeTest
    public void setUp() throws Exception {
        try {
            driver = new ChromeDriver();
            driver.manage().window().maximize();
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
            driver.get("https://login.salesforce.com/?locale=in");
            loginPage = new LoginPage(driver);
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    @Test
    public void testValidLogin() throws Exception {
        try {
            loginPage.enterUsername("valid.user@salesforce.com");
            loginPage.enterPassword("ValidPassword123!");
            loginPage.checkRememberMe();
            loginPage.clickLogin();
            Assert.assertTrue(driver.getCurrentUrl().contains("home"),
                    "Valid login failed. URL did not change to home.");
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    @AfterTest
    public void tearDown() throws Exception {
        try {
            if (driver != null) {
                driver.quit();
            }
        } catch (Exception e) {
            throw new Exception(e);
        }
    }
}
