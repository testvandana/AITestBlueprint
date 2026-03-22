package tests;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;
import pages.LoginPage;

import java.time.Duration;

public class InvalidLoginTest {
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
    public void testInvalidLogin() throws Exception {
        try {
            loginPage.enterUsername("invalid.user@salesforce.com");
            loginPage.enterPassword("WrongPassword123!");
            loginPage.clickLogin();
            String errorMsg = loginPage.getErrorMessage();
            Assert.assertTrue(errorMsg.length() > 0, "Error message was not displayed.");
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
